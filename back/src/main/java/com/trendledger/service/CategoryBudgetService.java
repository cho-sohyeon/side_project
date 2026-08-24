package com.trendledger.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.trendledger.domain.CategoryBudget;
import com.trendledger.domain.CategoryBudgetSaveRequest;
import com.trendledger.domain.CategoryBudgetStatus;
import com.trendledger.domain.CategorySummary;
import com.trendledger.domain.ExpenseStatRequest;
import com.trendledger.mapper.CategoryBudgetMapper;
import com.trendledger.mapper.ExpenseStatMapper;
import com.trendledger.util.AmountValidator;

@Service
public class CategoryBudgetService {

	private final CategoryBudgetMapper categoryBudgetMapper;
	private final ExpenseStatMapper expenseStatMapper;

	public CategoryBudgetService(CategoryBudgetMapper categoryBudgetMapper, ExpenseStatMapper expenseStatMapper) {
		this.categoryBudgetMapper = categoryBudgetMapper;
		this.expenseStatMapper = expenseStatMapper;
	}

	public void save(Long userId, CategoryBudgetSaveRequest request) {
		AmountValidator.validate(request.targetAmount());
		categoryBudgetMapper.upsert(userId, request.yearMonth(), request.category(), request.targetAmount());
	}

	public void delete(Long userId, String yearMonth, String category) {
		categoryBudgetMapper.delete(userId, yearMonth, category);
	}

	public List<CategoryBudgetStatus> getStatus(Long userId, String yearMonth) {
		List<CategoryBudget> budgets = categoryBudgetMapper.findByYearMonth(userId, yearMonth);
		Map<String, BigDecimal> spentByCategory = expenseStatMapper
				.findCategorySummaries(new ExpenseStatRequest(userId, yearMonth, yearMonth, null))
				.stream()
				.filter(s -> s.category() != null)
				.collect(Collectors.toMap(CategorySummary::category, CategorySummary::totalAmount));

		return budgets.stream()
				.map(b -> new CategoryBudgetStatus(
						b.category(),
						b.targetAmount(),
						spentByCategory.getOrDefault(b.category(), BigDecimal.ZERO)))
				.toList();
	}

}
