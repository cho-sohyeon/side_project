package com.trendledger.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseAnalyzeRequest;
import com.trendledger.domain.ExpenseAnalyzeResponse;
import com.trendledger.domain.ExpenseSaveRequest;
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
		ExpenseSaveRequest resolved = request.expenseDate() != null
				? request
				: new ExpenseSaveRequest(
						request.expenseDesc(),
						request.amount(),
						LocalDate.now(),
						request.category(),
						request.isTrendRelated());
		expenseMapper.insert(resolved);
	}

	public List<Expense> findAll() {
		return expenseMapper.findAll();
	}

}
