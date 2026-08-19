package com.trendledger.domain;

import java.math.BigDecimal;

public record CategorySummary(
		String category,
		BigDecimal totalAmount,
		BigDecimal ratio
) {
}
