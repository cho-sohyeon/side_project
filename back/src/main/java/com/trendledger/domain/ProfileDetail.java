package com.trendledger.domain;

import java.time.LocalDateTime;

public record ProfileDetail(
		Long profileId,
		String ageHouseholdType,
		boolean hasSubscriptionAccount,
		String livingType,
		String spendingHabitType,
		String investmentPropensityType,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {
}
