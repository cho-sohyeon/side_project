package com.trendledger.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseSaveRequest(
		String expenseDesc,
		BigDecimal amount,
		LocalDate expenseDate,
		String category,
		boolean isTrendRelated,
		String transactionType,
		boolean isSettlement
) {
}
