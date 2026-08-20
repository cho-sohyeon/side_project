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

	public void save(ExpenseSaveRequest request) {
		ExpenseSaveRequest resolved = new ExpenseSaveRequest(
				request.expenseDesc(),
				request.amount(),
				request.expenseDate() != null ? request.expenseDate() : LocalDate.now(),
				request.category(),
				request.isTrendRelated(),
				request.transactionType() != null ? request.transactionType() : "EXPENSE",
				request.isSettlement());
		expenseMapper.insert(resolved);
	}

	public void saveBulk(List<ExpenseSaveRequest> requests) {
		requests.forEach(this::save);
	}

	public void update(Long expenseId, ExpenseSaveRequest request) {
		ExpenseSaveRequest resolved = new ExpenseSaveRequest(
				request.expenseDesc(),
				request.amount(),
				request.expenseDate() != null ? request.expenseDate() : LocalDate.now(),
				request.category(),
				request.isTrendRelated(),
				request.transactionType() != null ? request.transactionType() : "EXPENSE",
				request.isSettlement());
		expenseMapper.update(expenseId, resolved);
	}

	public void delete(Long expenseId) {
		expenseMapper.delete(expenseId);
	}

	public List<Expense> findAll() {
		return expenseMapper.findAll();
	}

	public ExpenseSummaryResponse getSummary() {
		return expenseMapper.getSummary();
	}

}
