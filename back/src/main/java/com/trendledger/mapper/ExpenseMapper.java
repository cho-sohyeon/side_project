package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseSaveRequest;

@Mapper
public interface ExpenseMapper {

	void insert(ExpenseSaveRequest request);

	List<Expense> findAll();

}
