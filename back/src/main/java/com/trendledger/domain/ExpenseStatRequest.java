package com.trendledger.domain;

import java.util.List;

public record ExpenseStatRequest(
		Long userId,
		String startYearMonth,
		String endYearMonth,
		List<String> categories
) {
}
