package com.trendledger.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.Expense;
import com.trendledger.domain.ExpenseSaveRequest;
import com.trendledger.domain.ExpenseSummaryResponse;
import com.trendledger.domain.RecurringExpense;

@Mapper
public interface ExpenseMapper {

	void insert(@Param("userId") Long userId, @Param("request") ExpenseSaveRequest request);

	void update(@Param("userId") Long userId, @Param("expenseId") Long expenseId, @Param("request") ExpenseSaveRequest request);

	void delete(@Param("userId") Long userId, @Param("expenseId") Long expenseId);

	List<Expense> findAll(@Param("userId") Long userId);

	ExpenseSummaryResponse getSummary(@Param("userId") Long userId);

	void claimOrphaned(@Param("userId") Long userId);

	void deleteAllByUser(@Param("userId") Long userId);

	boolean existsForRecurringInMonth(@Param("userId") Long userId, @Param("recurringId") Long recurringId,
			@Param("yearMonth") String yearMonth);

	void insertFromRecurring(@Param("userId") Long userId, @Param("recurring") RecurringExpense recurring,
			@Param("expenseDate") LocalDate expenseDate);

}
