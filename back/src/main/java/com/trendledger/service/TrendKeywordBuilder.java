package com.trendledger.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.trendledger.domain.ProfileDetail;

@Component
public class TrendKeywordBuilder {

	private static final Map<String, String> AGE_HOUSEHOLD_KEYWORDS = Map.of(
			"YOUTH", "청년",
			"NEWLYWED", "신혼부부"
	);
	private static final Map<Boolean, String> SUBSCRIPTION_KEYWORDS = Map.of(
			false, "청약통장",
			true, "청약 경쟁률"
	);
	private static final Map<String, String> LIVING_KEYWORDS = Map.of(
			"INDEPENDENT", "전월세",
			"WITH_PARENTS", "내집마련"
	);
	private static final Map<String, String> SPENDING_HABIT_KEYWORDS = Map.of(
			"PLANNED", "재테크 전략",
			"IMPULSIVE", "절약 습관",
			"FRUGAL", "고금리 예적금"
	);
	private static final Map<String, String> INVESTMENT_KEYWORDS = Map.of(
			"CONSERVATIVE", "적금",
			"NEUTRAL", "ETF",
			"AGGRESSIVE", "주식"
	);
	private static final Map<String, String> TIER_KEYWORDS = Map.of(
			"NONE", "절약",
			"BRONZE", "절약",
			"SILVER", "재테크",
			"GOLD", "투자",
			"PLATINUM", "고수익 투자"
	);

	/**
	 * 청년 + 청약통장 미보유처럼 결합 시 의미가 강화되는 조합은 개별 키워드 대신
	 * 합성 키워드 하나로 대체해 키워드 슬롯을 아낀다.
	 */
	public String resolveSubscriptionKeyword(ProfileDetail p) {
		if ("YOUTH".equals(p.ageHouseholdType()) && !p.hasSubscriptionAccount()) {
			return "청약 제도";
		}
		return SUBSCRIPTION_KEYWORDS.get(p.hasSubscriptionAccount());
	}

	/**
	 * 우선순위 순 후보 키워드 목록: 투자성향 > 연령대/가구유형 > 청약통장 > 독립여부 > 소비습관.
	 * 티어 키워드는 항상 포함되고, 나머지는 이 순서대로 잘라내며 fallback 검색어를 만든다.
	 */
	public List<String> buildPriorityKeywords(Optional<ProfileDetail> profile) {
		List<String> keywords = new ArrayList<>();

		profile.ifPresent(p -> {
			if (INVESTMENT_KEYWORDS.containsKey(p.investmentPropensityType())) {
				keywords.add(INVESTMENT_KEYWORDS.get(p.investmentPropensityType()));
			}
			if (AGE_HOUSEHOLD_KEYWORDS.containsKey(p.ageHouseholdType())) {
				keywords.add(AGE_HOUSEHOLD_KEYWORDS.get(p.ageHouseholdType()));
			}
			String subscriptionKeyword = resolveSubscriptionKeyword(p);
			if (subscriptionKeyword != null) {
				keywords.add(subscriptionKeyword);
			}
			if (LIVING_KEYWORDS.containsKey(p.livingType())) {
				keywords.add(LIVING_KEYWORDS.get(p.livingType()));
			}
			if (SPENDING_HABIT_KEYWORDS.containsKey(p.spendingHabitType())) {
				keywords.add(SPENDING_HABIT_KEYWORDS.get(p.spendingHabitType()));
			}
		});

		return keywords;
	}

	public String tierKeyword(String tier) {
		return TIER_KEYWORDS.getOrDefault(tier, "재테크");
	}

	public String buildCacheKey(String tier, Optional<ProfileDetail> profile) {
		return profile
				.map(p -> String.join("|",
						tier,
						p.ageHouseholdType(),
						String.valueOf(p.hasSubscriptionAccount()),
						p.livingType(),
						p.spendingHabitType(),
						p.investmentPropensityType()))
				.orElse(tier + "|UNREGISTERED");
	}

}
