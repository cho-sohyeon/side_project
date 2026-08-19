package com.trendledger.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseAnalyzeRequest;
import com.trendledger.domain.ExpenseAnalyzeResponse;
import com.trendledger.domain.ExpenseSaveRequest;
import com.trendledger.domain.ExpenseStatRequest;
import com.trendledger.domain.ExpenseStatResponse;
import com.trendledger.service.ExpenseService;
import com.trendledger.service.ExpenseStatService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

	private final ExpenseService expenseService;
	private final ExpenseStatService expenseStatService;

	public ExpenseController(ExpenseService expenseService, ExpenseStatService expenseStatService) {
		this.expenseService = expenseService;
		this.expenseStatService = expenseStatService;
	}

	@PostMapping("/analyze")
	public ExpenseAnalyzeResponse analyze(@RequestBody ExpenseAnalyzeRequest request) {
		return expenseService.analyze(request);
	}

	@PostMapping
	public void save(@RequestBody ExpenseSaveRequest request) {
		expenseService.save(request);
	}

	@GetMapping
	public List<Expense> list() {
		return expenseService.findAll();
	}

	@GetMapping("/stats")
	public ExpenseStatResponse stats(
			@RequestParam(required = false) String startYearMonth,
			@RequestParam(required = false) String endYearMonth,
			@RequestParam(required = false) List<String> categories) {
		return expenseStatService.getStats(new ExpenseStatRequest(startYearMonth, endYearMonth, categories));
	}

}
