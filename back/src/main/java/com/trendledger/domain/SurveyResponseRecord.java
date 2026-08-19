package com.trendledger.domain;

public record SurveyResponseRecord(
		Long profileId,
		String surveyType,
		int surveyVersion,
		String questionCode,
		String selectedOption
) {
}
