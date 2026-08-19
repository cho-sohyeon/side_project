package com.trendledger.domain;

import java.math.BigDecimal;

public record BudgetGoalSaveRequest(
		String yearMonth,
		BigDecimal targetAmount
) {
}
