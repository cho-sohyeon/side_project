package com.trendledger.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import tools.jackson.databind.ObjectMapper;

import com.trendledger.domain.BudgetGoal;
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

	public TrendGuideService(BudgetGoalService budgetGoalService, ExpenseStatMapper expenseStatMapper,
			ProfileMapper profileMapper, TierCalculator tierCalculator, TrendKeywordBuilder trendKeywordBuilder,
			TrendGuideCacheMapper trendGuideCacheMapper, NaverNewsClient naverNewsClient, OpenAiClient openAiClient,
			OgImageExtractor ogImageExtractor, ObjectMapper objectMapper) {
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
	}

	public TrendGuideResponse getGuide() {
		YearMonth currentMonth = YearMonth.now();
		String currentYearMonth = currentMonth.format(YEAR_MONTH_FORMAT);

		BigDecimal actual = expenseStatMapper.findMonthlyTotal(currentYearMonth);
		BigDecimal baseline = resolveBaseline(currentMonth, currentYearMonth);

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

	private BigDecimal resolveBaseline(YearMonth currentMonth, String currentYearMonth) {
		Optional<BudgetGoal> goal = budgetGoalService.find(currentYearMonth);
		if (goal.isPresent()) {
			return goal.get().targetAmount();
		}

		BigDecimal sum = BigDecimal.ZERO;
		for (int i = 1; i <= 3; i++) {
			String yearMonth = currentMonth.minusMonths(i).format(YEAR_MONTH_FORMAT);
			sum = sum.add(expenseStatMapper.findMonthlyTotal(yearMonth));
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

		List<NewsCard> cards = merged.stream()
				.map(item -> {
					String title = stripHtml(item.get("title"));
					String description = stripHtml(item.get("description"));
					String insight = openAiClient.generatePersonalizedInsight(
							title, description, tier, investmentPropensityType, spendingHabitType, ageHouseholdType);
					String link = item.get("link");
					String imageUrl = ogImageExtractor.extract(link);
					return new NewsCard(title, insight, link, imageUrl);
				})
				.toList();

		trendGuideCacheMapper.upsert(cacheKey, tier, serializeCards(cards));
		return cards;
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
