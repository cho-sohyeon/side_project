package com.trendledger.domain;

import java.math.BigDecimal;

public record BudgetGoal(
		Long goalId,
		String yearMonth,
		BigDecimal targetAmount
) {
}
