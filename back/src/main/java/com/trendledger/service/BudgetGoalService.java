package com.trendledger.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.trendledger.domain.BudgetGoal;
import com.trendledger.domain.BudgetGoalSaveRequest;
import com.trendledger.mapper.BudgetGoalMapper;
import com.trendledger.util.AmountValidator;

@Service
public class BudgetGoalService {

	private final BudgetGoalMapper budgetGoalMapper;

	public BudgetGoalService(BudgetGoalMapper budgetGoalMapper) {
		this.budgetGoalMapper = budgetGoalMapper;
	}

	public void save(Long userId, BudgetGoalSaveRequest request) {
		AmountValidator.validate(request.targetAmount());
		budgetGoalMapper.upsert(userId, request.yearMonth(), request.targetAmount());
	}

	public Optional<BudgetGoal> find(Long userId, String yearMonth) {
		return budgetGoalMapper.findByYearMonth(userId, yearMonth);
	}

}
