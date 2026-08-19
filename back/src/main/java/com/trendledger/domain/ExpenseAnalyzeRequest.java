package com.trendledger.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseAnalyzeRequest(
		String expenseDesc,
		BigDecimal amount,
		LocalDate expenseDate
) {
}
