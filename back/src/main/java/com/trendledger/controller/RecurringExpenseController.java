package com.trendledger.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.RecurringExpense;
import com.trendledger.domain.RecurringExpenseSaveRequest;
import com.trendledger.service.RecurringExpenseService;

@RestController
@RequestMapping("/api/recurring")
public class RecurringExpenseController {

	private final RecurringExpenseService recurringExpenseService;

	public RecurringExpenseController(RecurringExpenseService recurringExpenseService) {
		this.recurringExpenseService = recurringExpenseService;
	}

	@PostMapping
	public void save(@RequestAttribute("userId") Long userId, @RequestBody RecurringExpenseSaveRequest request) {
		recurringExpenseService.save(userId, request);
	}

	@GetMapping
	public List<RecurringExpense> list(@RequestAttribute("userId") Long userId) {
		return recurringExpenseService.findActive(userId);
	}

	@DeleteMapping("/{recurringId}")
	public void deactivate(@RequestAttribute("userId") Long userId, @PathVariable Long recurringId) {
		recurringExpenseService.deactivate(userId, recurringId);
	}

	@PostMapping("/generate-due")
	public Map<String, Integer> generateDue(@RequestAttribute("userId") Long userId) {
		return Map.of("generated", recurringExpenseService.generateDue(userId));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleInvalidAmount(IllegalArgumentException e) {
		return e.getMessage();
	}

}
