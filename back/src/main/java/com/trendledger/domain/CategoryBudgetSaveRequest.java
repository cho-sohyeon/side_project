package com.trendledger.domain;

import java.math.BigDecimal;

public record CategoryBudgetSaveRequest(
		String yearMonth,
		String category,
		BigDecimal targetAmount
) {
}
