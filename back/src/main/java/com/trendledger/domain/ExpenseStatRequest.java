package com.trendledger.domain;

import java.util.List;

public record ExpenseStatRequest(
		String startYearMonth,
		String endYearMonth,
		List<String> categories
) {
}
