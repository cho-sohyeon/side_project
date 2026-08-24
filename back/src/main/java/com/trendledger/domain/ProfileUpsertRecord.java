package com.trendledger.domain;

public record ProfileUpsertRecord(
		Long profileId,
		Long userId,
		String ageHouseholdType,
		boolean hasSubscriptionAccount,
		String livingType,
		String spendingHabitType,
		String investmentPropensityType
) {
}
