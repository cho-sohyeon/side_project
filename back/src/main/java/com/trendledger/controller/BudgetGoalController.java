package com.trendledger.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.BudgetGoal;
import com.trendledger.domain.BudgetGoalSaveRequest;
import com.trendledger.service.BudgetGoalService;

@RestController
@RequestMapping("/api/budget-goals")
public class BudgetGoalController {

	private final BudgetGoalService budgetGoalService;

	public BudgetGoalController(BudgetGoalService budgetGoalService) {
		this.budgetGoalService = budgetGoalService;
	}

	@PostMapping
	public void save(@RequestBody BudgetGoalSaveRequest request) {
		budgetGoalService.save(request);
	}

	@GetMapping("/{yearMonth}")
	public BudgetGoal find(@PathVariable String yearMonth) {
		return budgetGoalService.find(yearMonth).orElse(null);
	}

}
