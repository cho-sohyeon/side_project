package com.trendledger.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import tools.jackson.databind.ObjectMapper;

import com.trendledger.domain.BudgetGoal;
import com.trendledger.domain.ExpenseStatRequest;
import com.trendledger.domain.MonthlySummary;
import com.trendledger.domain.NewsCard;
import com.trendledger.domain.NewsSearchResult;
import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.TrendGuideResponse;
import com.trendledger.mapper.ExpenseStatMapper;
import com.trendledger.mapper.ProfileMapper;
import com.trendledger.mapper.TrendGuideCacheMapper;

@Service
public class TrendGuideService {

	private static final DateTimeFormatter YEAR_MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");
	private static final String UNREGISTERED_MESSAGE = "프로필을 등록하면 더 맞춤화된 가이드를 받을 수 있어요";
	private static final int TOTAL_CARDS = 5;
	private static final int PRIMARY_QUERY_MAX_CARDS = 3;
	private static final String TODAY_ISSUE_CACHE_KEY = "TODAY_ISSUE";
	private static final String TODAY_ISSUE_KEYWORD = "경제 이슈";
	private static final String INTEREST_ISSUE_CACHE_PREFIX = "INTEREST_ISSUE|";
	private static final List<String> DEFAULT_INTEREST_TOPICS = List.of("SUBSCRIPTION", "HAPPY_HOUSING", "REAL_ESTATE_POLICY");
	private static final Map<String, String> TOPIC_KEYWORDS = Map.ofEntries(
			Map.entry("SUBSCRIPTION", "청약"),
			Map.entry("HAPPY_HOUSING", "행복주택"),
			Map.entry("REAL_ESTATE_POLICY", "부동산 대책"),
			Map.entry("STOCK", "주식"),
			Map.entry("ETF", "ETF"),
			Map.entry("CRYPTO", "코인"),
			Map.entry("SAVINGS", "예적금"),
			Map.entry("TAX_SAVING", "절세"),
			Map.entry("BOND", "채권"),
			Map.entry("FUND", "펀드")
	);

	private final ExecutorService cardBuildExecutor = Executors.newFixedThreadPool(TOTAL_CARDS);

	private final BudgetGoalService budgetGoalService;
	private final ExpenseStatMapper expenseStatMapper;
	private final ProfileMapper profileMapper;
	private final TierCalculator tierCalculator;
	private final TrendKeywordBuilder trendKeywordBuilder;
	private final TrendGuideCacheMapper trendGuideCacheMapper;
	private final NaverNewsClient naverNewsClient;
	private final OpenAiClient openAiClient;
	private final OgImageExtractor ogImageExtractor;
	private final ObjectMapper objectMapper;
	private final InterestTopicService interestTopicService;

	public TrendGuideService(BudgetGoalService budgetGoalService, ExpenseStatMapper expenseStatMapper,
			ProfileMapper profileMapper, TierCalculator tierCalculator, TrendKeywordBuilder trendKeywordBuilder,
			TrendGuideCacheMapper trendGuideCacheMapper, NaverNewsClient naverNewsClient, OpenAiClient openAiClient,
			OgImageExtractor ogImageExtractor, ObjectMapper objectMapper, InterestTopicService interestTopicService) {
		this.budgetGoalService = budgetGoalService;
		this.expenseStatMapper = expenseStatMapper;
		this.profileMapper = profileMapper;
		this.tierCalculator = tierCalculator;
		this.trendKeywordBuilder = trendKeywordBuilder;
		this.trendGuideCacheMapper = trendGuideCacheMapper;
		this.naverNewsClient = naverNewsClient;
		this.openAiClient = openAiClient;
		this.ogImageExtractor = ogImageExtractor;
		this.objectMapper = objectMapper;
		this.interestTopicService = interestTopicService;
	}

	public TrendGuideResponse getGuide() {
		YearMonth currentMonth = YearMonth.now();
		String currentYearMonth = currentMonth.format(YEAR_MONTH_FORMAT);
		String earliestYearMonth = currentMonth.minusMonths(3).format(YEAR_MONTH_FORMAT);

		// 이번 달 실적 + 최근 3개월 기준선 계산에 필요한 월별 합계를 한 번의 조회로 가져온다
		// (기존에는 findMonthlyTotal을 최대 4회 순차 호출했다).
		Map<String, BigDecimal> monthlyTotals = expenseStatMapper
				.findMonthlySummaries(new ExpenseStatRequest(earliestYearMonth, currentYearMonth, null))
				.stream()
				.collect(Collectors.toMap(MonthlySummary::yearMonth, MonthlySummary::totalAmount));

		BigDecimal actual = monthlyTotals.getOrDefault(currentYearMonth, BigDecimal.ZERO);
		BigDecimal baseline = resolveBaseline(currentMonth, currentYearMonth, monthlyTotals);

		BigDecimal savingsRate = tierCalculator.calculateSavingsRate(baseline, actual);
		String tier = tierCalculator.calculateTier(savingsRate);

		Optional<ProfileDetail> profile = profileMapper.findOne();
		String cacheKey = trendKeywordBuilder.buildCacheKey(tier, profile);

		List<NewsCard> cards = trendGuideCacheMapper.findValidCardsJson(cacheKey)
				.map(this::deserializeCards)
				.orElseGet(() -> fetchAndCacheCards(tier, profile, cacheKey));

		boolean profileRegistered = profile.isPresent();
		return new TrendGuideResponse(
				tier,
				savingsRate,
				profileRegistered,
				profileRegistered ? null : UNREGISTERED_MESSAGE,
				cards
		);
	}

	/**
	 * 프로필과 무관하게 오늘 화제가 된 경제 뉴스 여러 건을 반환한다 (홈 배너 카드뉴스용).
	 */
	public List<NewsCard> getTodayIssues() {
		return trendGuideCacheMapper.findValidCardsJson(TODAY_ISSUE_CACHE_KEY)
				.map(this::deserializeCards)
				.orElseGet(this::fetchAndCacheTodayIssue);
	}

	private List<NewsCard> fetchAndCacheTodayIssue() {
		NewsSearchResult result = naverNewsClient.searchNews(TODAY_ISSUE_KEYWORD, TOTAL_CARDS, "date");
		if (result.total() == 0 || result.items().isEmpty()) {
			return List.of();
		}

		List<NewsCard> cards = buildCardsInParallel(
				result.items(), "일반", "정보 없음", "정보 없음", "정보 없음");

		trendGuideCacheMapper.upsert(TODAY_ISSUE_CACHE_KEY, "TODAY", serializeCards(cards));
		return cards;
	}

	/**
	 * 프로필/설문과 무관하게 사용자가 직접 고른 재테크 관심 주제(청약, 주식, ETF 등)의 뉴스를 반환한다.
	 * 선택된 주제가 없으면 기본 주제(청약·행복주택·부동산 대책)로 대체한다.
	 */
	public List<NewsCard> getInterestIssues() {
		List<String> selectedTopics = interestTopicService.getSelectedTopics();
		List<String> topics = selectedTopics.isEmpty() ? DEFAULT_INTEREST_TOPICS : selectedTopics;
		List<String> keywords = topics.stream()
				.map(code -> TOPIC_KEYWORDS.getOrDefault(code, code))
				.toList();

		// 선택 조합이 바뀌면 다른 캐시를 쓰도록 정렬된 토픽 코드로 캐시 키를 구성한다.
		String cacheKey = INTEREST_ISSUE_CACHE_PREFIX + topics.stream().sorted().collect(Collectors.joining(","));

		return trendGuideCacheMapper.findValidCardsJson(cacheKey)
				.map(this::deserializeCards)
				.orElseGet(() -> fetchAndCacheInterestIssues(cacheKey, keywords));
	}

	private List<NewsCard> fetchAndCacheInterestIssues(String cacheKey, List<String> keywords) {
		int perKeyword = (TOTAL_CARDS / keywords.size()) + 1;
		Map<String, Map<String, String>> byLink = new LinkedHashMap<>();
		for (String keyword : keywords) {
			NewsSearchResult result = naverNewsClient.searchNews(keyword, perKeyword, "date");
			for (Map<String, String> item : result.items()) {
				byLink.putIfAbsent(item.get("link"), item);
			}
		}
		List<Map<String, String>> items = byLink.values().stream().limit(TOTAL_CARDS).toList();
		if (items.isEmpty()) {
			return List.of();
		}

		List<NewsCard> cards = buildCardsInParallel(
				items, "일반", "정보 없음", "정보 없음", "정보 없음");

		trendGuideCacheMapper.upsert(cacheKey, "INTEREST", serializeCards(cards));
		return cards;
	}

	private BigDecimal resolveBaseline(YearMonth currentMonth, String currentYearMonth, Map<String, BigDecimal> monthlyTotals) {
		Optional<BudgetGoal> goal = budgetGoalService.find(currentYearMonth);
		if (goal.isPresent()) {
			return goal.get().targetAmount();
		}

		BigDecimal sum = BigDecimal.ZERO;
		for (int i = 1; i <= 3; i++) {
			String yearMonth = currentMonth.minusMonths(i).format(YEAR_MONTH_FORMAT);
			sum = sum.add(monthlyTotals.getOrDefault(yearMonth, BigDecimal.ZERO));
		}
		return sum.divide(BigDecimal.valueOf(3), 2, java.math.RoundingMode.HALF_UP);
	}

	private List<NewsCard> fetchAndCacheCards(String tier, Optional<ProfileDetail> profile, String cacheKey) {
		String tierKeyword = trendKeywordBuilder.tierKeyword(tier);
		List<String> priorityKeywords = trendKeywordBuilder.buildPriorityKeywords(profile);

		// 검색 A: 투자성향(가장 중요한 축) 중심 — 티어 + 투자성향 키워드
		List<String> primaryCandidates = priorityKeywords.isEmpty()
				? List.of()
				: List.of(priorityKeywords.get(0));
		NewsSearchResult resultA = searchWithFallback(tierKeyword, primaryCandidates, PRIMARY_QUERY_MAX_CARDS);

		// 검색 B: 나머지 축(연령대/가구유형, 청약통장, 독립여부, 소비습관) — 결과 다양성 확보용
		List<String> secondaryCandidates = priorityKeywords.size() > 1
				? priorityKeywords.subList(1, priorityKeywords.size())
				: List.of();
		NewsSearchResult resultB = searchWithFallback(tierKeyword, secondaryCandidates, TOTAL_CARDS - PRIMARY_QUERY_MAX_CARDS);

		List<Map<String, String>> merged = mergeAndDedupe(resultA.items(), resultB.items(), TOTAL_CARDS);

		String investmentPropensityType = profile.map(ProfileDetail::investmentPropensityType).orElse("정보 없음");
		String spendingHabitType = profile.map(ProfileDetail::spendingHabitType).orElse("정보 없음");
		String ageHouseholdType = profile.map(ProfileDetail::ageHouseholdType).orElse("정보 없음");

		List<NewsCard> cards = buildCardsInParallel(
				merged, tier, investmentPropensityType, spendingHabitType, ageHouseholdType);

		trendGuideCacheMapper.upsert(cacheKey, tier, serializeCards(cards));
		return cards;
	}

	/**
	 * 카드별 OpenAI 인사이트 생성 + og:image 스크래핑은 각각 최대 1초 안팎 걸리는 블로킹 I/O라
	 * 직렬 처리 시 카드 수만큼 누적된다. CompletableFuture로 병렬 처리해 전체 응답 시간을 단축한다.
	 */
	private List<NewsCard> buildCardsInParallel(
			List<Map<String, String>> items, String tier,
			String investmentPropensityType, String spendingHabitType, String ageHouseholdType) {
		List<CompletableFuture<NewsCard>> futures = items.stream()
				.map(item -> CompletableFuture.supplyAsync(() -> {
					String title = stripHtml(item.get("title"));
					String description = stripHtml(item.get("description"));
					String insight = openAiClient.generatePersonalizedInsight(
							title, description, tier, investmentPropensityType, spendingHabitType, ageHouseholdType);
					String link = item.get("link");
					String imageUrl = ogImageExtractor.extract(link);
					return new NewsCard(title, insight, link, imageUrl);
				}, cardBuildExecutor))
				.toList();

		return futures.stream().map(CompletableFuture::join).toList();
	}

	/**
	 * candidateKeywords를 뒤에서부터 하나씩 잘라내며 검색해, 결과가 0건이 아닌 첫 조합을 채택한다.
	 * candidateKeywords가 비어도 tierKeyword 단독으로는 검색한다.
	 */
	private NewsSearchResult searchWithFallback(String tierKeyword, List<String> candidateKeywords, int count) {
		for (int n = candidateKeywords.size(); n >= 0; n--) {
			List<String> parts = new ArrayList<>();
			parts.add(tierKeyword);
			parts.addAll(candidateKeywords.subList(0, n));
			String query = String.join(" ", parts);

			NewsSearchResult result = naverNewsClient.searchNews(query, count, "sim");
			if (result.total() > 0) {
				return result;
			}
		}
		return new NewsSearchResult(0, List.of());
	}

	private List<Map<String, String>> mergeAndDedupe(List<Map<String, String>> a, List<Map<String, String>> b, int limit) {
		Map<String, Map<String, String>> byLink = new LinkedHashMap<>();
		for (Map<String, String> item : a) {
			byLink.putIfAbsent(item.get("link"), item);
		}
		for (Map<String, String> item : b) {
			byLink.putIfAbsent(item.get("link"), item);
		}
		return byLink.values().stream().limit(limit).toList();
	}

	private String stripHtml(String text) {
		return text == null ? "" : text.replaceAll("<[^>]*>", "");
	}

	private String serializeCards(List<NewsCard> cards) {
		return objectMapper.writeValueAsString(cards);
	}

	private List<NewsCard> deserializeCards(String json) {
		return objectMapper.readValue(json, objectMapper.getTypeFactory()
				.constructCollectionType(List.class, NewsCard.class));
	}

}
