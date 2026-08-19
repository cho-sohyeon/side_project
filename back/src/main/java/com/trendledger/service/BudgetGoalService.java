package com.trendledger.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.trendledger.domain.BudgetGoal;
import com.trendledger.domain.BudgetGoalSaveRequest;
import com.trendledger.mapper.BudgetGoalMapper;

@Service
public class BudgetGoalService {

	private final BudgetGoalMapper budgetGoalMapper;

	public BudgetGoalService(BudgetGoalMapper budgetGoalMapper) {
		this.budgetGoalMapper = budgetGoalMapper;
	}

	public void save(BudgetGoalSaveRequest request) {
		budgetGoalMapper.upsert(request.yearMonth(), request.targetAmount());
	}

	public Optional<BudgetGoal> find(String yearMonth) {
		return budgetGoalMapper.findByYearMonth(yearMonth);
	}

}
