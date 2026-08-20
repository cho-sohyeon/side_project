package com.trendledger.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import com.trendledger.domain.ExpenseSummaryResponse;
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

	@PostMapping("/bulk")
	public void saveBulk(@RequestBody List<ExpenseSaveRequest> requests) {
		expenseService.saveBulk(requests);
	}

	@PutMapping("/{expenseId}")
	public void update(@PathVariable Long expenseId, @RequestBody ExpenseSaveRequest request) {
		expenseService.update(expenseId, request);
	}

	@DeleteMapping("/{expenseId}")
	public void delete(@PathVariable Long expenseId) {
		expenseService.delete(expenseId);
	}

	@GetMapping
	public List<Expense> list() {
		return expenseService.findAll();
	}

	@GetMapping("/summary")
	public ExpenseSummaryResponse summary() {
		return expenseService.getSummary();
	}

	@GetMapping("/stats")
	public ExpenseStatResponse stats(
			@RequestParam(required = false) String startYearMonth,
			@RequestParam(required = false) String endYearMonth,
			@RequestParam(required = false) List<String> categories) {
		return expenseStatService.getStats(new ExpenseStatRequest(startYearMonth, endYearMonth, categories));
	}

}
