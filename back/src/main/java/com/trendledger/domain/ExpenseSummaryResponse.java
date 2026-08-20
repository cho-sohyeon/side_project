package com.trendledger.domain;

import java.math.BigDecimal;

public record ExpenseSummaryResponse(
		BigDecimal totalIncome,
		BigDecimal totalExpense,
		BigDecimal netPersonalExpense,
		BigDecimal netPersonalIncome,
		BigDecimal balance
) {
}
