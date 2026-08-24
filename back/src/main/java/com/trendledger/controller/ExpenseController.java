package com.trendledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
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
	public void save(@RequestAttribute("userId") Long userId, @RequestBody ExpenseSaveRequest request) {
		expenseService.save(userId, request);
	}

	@PostMapping("/bulk")
	public void saveBulk(@RequestAttribute("userId") Long userId, @RequestBody List<ExpenseSaveRequest> requests) {
		expenseService.saveBulk(userId, requests);
	}

	@PutMapping("/{expenseId}")
	public void update(@RequestAttribute("userId") Long userId, @PathVariable Long expenseId, @RequestBody ExpenseSaveRequest request) {
		expenseService.update(userId, expenseId, request);
	}

	@DeleteMapping("/{expenseId}")
	public void delete(@RequestAttribute("userId") Long userId, @PathVariable Long expenseId) {
		expenseService.delete(userId, expenseId);
	}

	@GetMapping
	public List<Expense> list(@RequestAttribute("userId") Long userId) {
		return expenseService.findAll(userId);
	}

	@GetMapping("/summary")
	public ExpenseSummaryResponse summary(@RequestAttribute("userId") Long userId) {
		return expenseService.getSummary(userId);
	}

	@GetMapping("/stats")
	public ExpenseStatResponse stats(
			@RequestAttribute("userId") Long userId,
			@RequestParam(required = false) String startYearMonth,
			@RequestParam(required = false) String endYearMonth,
			@RequestParam(required = false) List<String> categories) {
		return expenseStatService.getStats(new ExpenseStatRequest(userId, startYearMonth, endYearMonth, categories));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleInvalidAmount(IllegalArgumentException e) {
		return e.getMessage();
	}

}
