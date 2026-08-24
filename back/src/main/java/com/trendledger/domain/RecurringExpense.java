package com.trendledger.domain;

import java.math.BigDecimal;

public record RecurringExpense(
		Long recurringId,
		String expenseDesc,
		BigDecimal amount,
		String category,
		String transactionType,
		int dayOfMonth,
		boolean isActive
) {
}
