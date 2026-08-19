package com.trendledger.domain;

public record FilterPresetSaveRequest(
		String presetName,
		String startYearMonth,
		String endYearMonth,
		String categories
) {
}
