package com.trendledger.domain;

import java.math.BigDecimal;

public record CategoryBudget(
		String category,
		BigDecimal targetAmount
) {
}
