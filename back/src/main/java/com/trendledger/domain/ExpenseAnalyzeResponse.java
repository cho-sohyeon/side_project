package com.trendledger.domain;

public record ExpenseAnalyzeResponse(
		String category,
		boolean isTrendRelated
) {
}
