package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.RecurringExpense;
import com.trendledger.domain.RecurringExpenseSaveRequest;

@Mapper
public interface RecurringExpenseMapper {

	void insert(@Param("userId") Long userId, @Param("request") RecurringExpenseSaveRequest request);

	List<RecurringExpense> findActiveByUser(@Param("userId") Long userId);

	void deactivate(@Param("userId") Long userId, @Param("recurringId") Long recurringId);

}
