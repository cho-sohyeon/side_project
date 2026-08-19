package com.trendledger.domain;

import java.util.List;

public record ProfileRegisterRequest(
		String ageHouseholdType,
		boolean hasSubscriptionAccount,
		String livingType,
		List<String> spendingHabitAnswers,
		List<String> investmentAnswers
) {
}
