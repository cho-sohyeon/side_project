package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseSaveRequest;
import com.trendledger.domain.ExpenseSummaryResponse;

@Mapper
public interface ExpenseMapper {

	void insert(ExpenseSaveRequest request);

	void update(@Param("expenseId") Long expenseId, @Param("request") ExpenseSaveRequest request);

	void delete(@Param("expenseId") Long expenseId);

	List<Expense> findAll();

	ExpenseSummaryResponse getSummary();

}
