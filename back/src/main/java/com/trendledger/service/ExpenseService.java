package com.trendledger.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseAnalyzeRequest;
import com.trendledger.domain.ExpenseAnalyzeResponse;
import com.trendledger.domain.ExpenseSaveRequest;
import com.trendledger.domain.ExpenseSummaryResponse;
import com.trendledger.mapper.ExpenseMapper;

@Service
public class ExpenseService {

	private final OpenAiClient openAiClient;
	private final ExpenseMapper expenseMapper;

	public ExpenseService(OpenAiClient openAiClient, ExpenseMapper expenseMapper) {
		this.openAiClient = openAiClient;
		this.expenseMapper = expenseMapper;
	}

	public ExpenseAnalyzeResponse analyze(ExpenseAnalyzeRequest request) {
		return openAiClient.classify(request.expenseDesc());
	}

	public void save(Long userId, ExpenseSaveRequest request) {
		ExpenseSaveRequest resolved = new ExpenseSaveRequest(
				request.expenseDesc(),
				request.amount(),
				request.expenseDate() != null ? request.expenseDate() : LocalDate.now(),
				request.category(),
				request.isTrendRelated(),
				request.transactionType() != null ? request.transactionType() : "EXPENSE",
				request.isSettlement());
		expenseMapper.insert(userId, resolved);
	}

	public void saveBulk(Long userId, List<ExpenseSaveRequest> requests) {
		requests.forEach(request -> save(userId, request));
	}

	public void update(Long userId, Long expenseId, ExpenseSaveRequest request) {
		ExpenseSaveRequest resolved = new ExpenseSaveRequest(
				request.expenseDesc(),
				request.amount(),
				request.expenseDate() != null ? request.expenseDate() : LocalDate.now(),
				request.category(),
				request.isTrendRelated(),
				request.transactionType() != null ? request.transactionType() : "EXPENSE",
				request.isSettlement());
		expenseMapper.update(userId, expenseId, resolved);
	}

	public void delete(Long userId, Long expenseId) {
		expenseMapper.delete(userId, expenseId);
	}

	public List<Expense> findAll(Long userId) {
		return expenseMapper.findAll(userId);
	}

	public ExpenseSummaryResponse getSummary(Long userId) {
		return expenseMapper.getSummary(userId);
	}

}
