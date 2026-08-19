package com.trendledger.domain;

import java.math.BigDecimal;

public record MonthlySummary(
		String yearMonth,
		BigDecimal totalAmount
) {
}
