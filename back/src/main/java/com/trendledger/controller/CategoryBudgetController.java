package com.trendledger.controller;

import java.util.List;

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

import com.trendledger.domain.CategoryBudgetSaveRequest;
import com.trendledger.domain.CategoryBudgetStatus;
import com.trendledger.service.CategoryBudgetService;

@RestController
@RequestMapping("/api/category-budgets")
public class CategoryBudgetController {

	private final CategoryBudgetService categoryBudgetService;

	public CategoryBudgetController(CategoryBudgetService categoryBudgetService) {
		this.categoryBudgetService = categoryBudgetService;
	}

	@PostMapping
	public void save(@RequestAttribute("userId") Long userId, @RequestBody CategoryBudgetSaveRequest request) {
		categoryBudgetService.save(userId, request);
	}

	@GetMapping("/{yearMonth}")
	public List<CategoryBudgetStatus> getStatus(@RequestAttribute("userId") Long userId, @PathVariable String yearMonth) {
		return categoryBudgetService.getStatus(userId, yearMonth);
	}

	@DeleteMapping("/{yearMonth}/{category}")
	public void delete(@RequestAttribute("userId") Long userId, @PathVariable String yearMonth, @PathVariable String category) {
		categoryBudgetService.delete(userId, yearMonth, category);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleInvalidAmount(IllegalArgumentException e) {
		return e.getMessage();
	}

}
