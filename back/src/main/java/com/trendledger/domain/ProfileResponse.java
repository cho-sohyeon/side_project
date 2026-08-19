package com.trendledger.domain;

import java.util.List;

public record ProfileResponse(
		boolean registered,
		ProfileDetail profile,
		List<String> spendingHabitAnswers,
		List<String> investmentAnswers
) {
}
