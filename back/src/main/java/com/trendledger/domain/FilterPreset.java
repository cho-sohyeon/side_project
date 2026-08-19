package com.trendledger.domain;

public record FilterPreset(
		Long presetId,
		String presetName,
		String startYearMonth,
		String endYearMonth,
		String categories
) {
}
