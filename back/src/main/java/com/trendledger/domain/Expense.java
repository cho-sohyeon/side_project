package com.trendledger.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record Expense(
		Long expenseId,
		String expenseDesc,
		BigDecimal amount,
		LocalDate expenseDate,
		String category,
		boolean isTrendRelated,
		String transactionType,
		boolean isSettlement,
		LocalDateTime createdAt
) {
}
