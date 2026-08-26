package com.trendledger.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminUserSummary(
		Long userId,
		String username,
		String nickname,
		String role,
		LocalDateTime createdAt,
		long expenseCount,
		BigDecimal totalExpenseAmount,
		BigDecimal totalIncomeAmount
) {
}
