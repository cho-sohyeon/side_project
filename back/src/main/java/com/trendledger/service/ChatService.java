package com.trendledger.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.trendledger.domain.BudgetGoal;
import com.trendledger.domain.ChatMessage;
import com.trendledger.domain.ExpenseSummaryResponse;
import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.TrendGuideResponse;
import com.trendledger.mapper.ChatMessageMapper;

@Service
public class ChatService {

	private static final int HISTORY_LIMIT = 20;
	private static final DateTimeFormatter YEAR_MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

	private final ChatMessageMapper chatMessageMapper;
	private final ProfileService profileService;
	private final ExpenseService expenseService;
	private final BudgetGoalService budgetGoalService;
	private final TrendGuideService trendGuideService;
	private final OpenAiClient openAiClient;

	public ChatService(ChatMessageMapper chatMessageMapper, ProfileService profileService,
			ExpenseService expenseService, BudgetGoalService budgetGoalService, TrendGuideService trendGuideService,
			OpenAiClient openAiClient) {
		this.chatMessageMapper = chatMessageMapper;
		this.profileService = profileService;
		this.expenseService = expenseService;
		this.budgetGoalService = budgetGoalService;
		this.trendGuideService = trendGuideService;
		this.openAiClient = openAiClient;
	}

	public List<ChatMessage> getHistory(Long userId) {
		return chatMessageMapper.findByUser(userId);
	}

	public void clearHistory(Long userId) {
		chatMessageMapper.deleteAllByUser(userId);
	}

	public ChatMessage sendMessage(Long userId, String userMessage) {
		List<ChatMessage> history = chatMessageMapper.findRecentByUser(userId, HISTORY_LIMIT);
		String userContext = buildUserContext(userId);

		chatMessageMapper.insert(userId, "user", userMessage);

		String reply = openAiClient.chat(userContext, history, userMessage);

		chatMessageMapper.insert(userId, "assistant", reply);
		return new ChatMessage(null, "assistant", reply, null);
	}

	private String buildUserContext(Long userId) {
		Optional<ProfileDetail> profile = profileService.getProfile(userId);
		ExpenseSummaryResponse summary = expenseService.getSummary(userId);
		String currentYearMonth = LocalDate.now().format(YEAR_MONTH_FORMAT);
		Optional<BudgetGoal> goal = budgetGoalService.find(userId, currentYearMonth);

		String tier = "정보 없음";
		try {
			TrendGuideResponse guide = trendGuideService.getGuide(userId, false);
			tier = guide.tier();
		} catch (Exception ignored) {
			// 트렌드 가이드 조회 실패해도 챗봇 자체는 동작해야 하므로 무시
		}

		StringBuilder sb = new StringBuilder("[사용자 재무 현황]\n");
		sb.append("절약 티어: ").append(tier).append("\n");
		if (profile.isPresent()) {
			ProfileDetail p = profile.get();
			sb.append("연령대/가구유형: ").append(p.ageHouseholdType()).append("\n");
			sb.append("청약통장 보유: ").append(p.hasSubscriptionAccount() ? "있음" : "없음").append("\n");
			sb.append("독립 여부: ").append(p.livingType()).append("\n");
			sb.append("소비습관 유형: ").append(p.spendingHabitType()).append("\n");
			sb.append("투자 성향: ").append(p.investmentPropensityType()).append("\n");
		} else {
			sb.append("프로필 미등록 상태\n");
		}
		sb.append("순수입(정산 제외): ").append(summary.netPersonalIncome()).append("원\n");
		sb.append("순지출(정산 제외): ").append(summary.netPersonalExpense()).append("원\n");
		sb.append("잔액: ").append(summary.balance()).append("원\n");
		if (goal.isPresent()) {
			sb.append("이번 달 예산 목표: ").append(goal.get().targetAmount()).append("원\n");
		} else {
			sb.append("이번 달 예산 목표: 미설정\n");
		}

		return sb.toString();
	}

}
