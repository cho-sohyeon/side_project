package com.trendledger.domain;

import java.util.List;

public record ExpenseStatResponse(
		List<CategorySummary> categorySummaries,
		List<MonthlySummary> monthlySummaries
) {
}
