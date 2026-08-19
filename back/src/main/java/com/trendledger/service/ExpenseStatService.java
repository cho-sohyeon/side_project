package com.trendledger.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.domain.CategorySummary;
import com.trendledger.domain.ExpenseStatRequest;
import com.trendledger.domain.ExpenseStatResponse;
import com.trendledger.domain.MonthlySummary;
import com.trendledger.mapper.ExpenseStatMapper;

@Service
public class ExpenseStatService {

	private final ExpenseStatMapper expenseStatMapper;

	public ExpenseStatService(ExpenseStatMapper expenseStatMapper) {
		this.expenseStatMapper = expenseStatMapper;
	}

	public ExpenseStatResponse getStats(ExpenseStatRequest request) {
		List<CategorySummary> categorySummaries = expenseStatMapper.findCategorySummaries(request);
		List<MonthlySummary> monthlySummaries = expenseStatMapper.findMonthlySummaries(request);

		BigDecimal total = categorySummaries.stream()
				.map(CategorySummary::totalAmount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		List<CategorySummary> withRatio = categorySummaries.stream()
				.map(summary -> new CategorySummary(
						summary.category(),
						summary.totalAmount(),
						total.compareTo(BigDecimal.ZERO) > 0
								? summary.totalAmount().multiply(BigDecimal.valueOf(100))
										.divide(total, 1, RoundingMode.HALF_UP)
								: BigDecimal.ZERO))
				.toList();

		return new ExpenseStatResponse(withRatio, monthlySummaries);
	}

}
