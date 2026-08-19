package com.trendledger.domain;

public record SurveyAnswerRow(
		String surveyType,
		String questionCode,
		String selectedOption
) {
}
