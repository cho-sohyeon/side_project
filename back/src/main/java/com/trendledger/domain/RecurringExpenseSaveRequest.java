package com.trendledger.domain;

import java.math.BigDecimal;

public record RecurringExpenseSaveRequest(
		String expenseDesc,
		BigDecimal amount,
		String category,
		String transactionType,
		int dayOfMonth
) {
}
