package com.trendledger.domain;

import java.math.BigDecimal;

public record CategoryBudgetStatus(
		String category,
		BigDecimal targetAmount,
		BigDecimal spentAmount
) {
}
