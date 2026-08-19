package com.trendledger.domain;

public record ProfileUpsertRecord(
		Long profileId,
		String ageHouseholdType,
		boolean hasSubscriptionAccount,
		String livingType,
		String spendingHabitType,
		String investmentPropensityType
) {
}
