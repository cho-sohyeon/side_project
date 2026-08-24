package com.trendledger.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.domain.RecurringExpense;
import com.trendledger.domain.RecurringExpenseSaveRequest;
import com.trendledger.mapper.ExpenseMapper;
import com.trendledger.mapper.RecurringExpenseMapper;

@Service
public class RecurringExpenseService {

	private static final DateTimeFormatter YEAR_MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

	private final RecurringExpenseMapper recurringExpenseMapper;
	private final ExpenseMapper expenseMapper;

	public RecurringExpenseService(RecurringExpenseMapper recurringExpenseMapper, ExpenseMapper expenseMapper) {
		this.recurringExpenseMapper = recurringExpenseMapper;
		this.expenseMapper = expenseMapper;
	}

	public void save(Long userId, RecurringExpenseSaveRequest request) {
		recurringExpenseMapper.insert(userId, request);
	}

	public List<RecurringExpense> findActive(Long userId) {
		return recurringExpenseMapper.findActiveByUser(userId);
	}

	public void deactivate(Long userId, Long recurringId) {
		recurringExpenseMapper.deactivate(userId, recurringId);
	}

	/**
	 * 이번 달에 아직 생성되지 않았고 지정한 날짜가 지난 반복 항목들을 지출/수입으로 자동 등록한다.
	 * 앱 접속 시마다 호출해도 안전하도록(idempotent) recurring_id + 해당 월 존재 여부로 중복을 막는다.
	 */
	public int generateDue(Long userId) {
		LocalDate today = LocalDate.now();
		String currentYearMonth = today.format(YEAR_MONTH_FORMAT);
		int daysInMonth = YearMonth.now().lengthOfMonth();

		int generated = 0;
		for (RecurringExpense recurring : recurringExpenseMapper.findActiveByUser(userId)) {
			if (recurring.dayOfMonth() > today.getDayOfMonth()) {
				continue;
			}
			if (expenseMapper.existsForRecurringInMonth(userId, recurring.recurringId(), currentYearMonth)) {
				continue;
			}
			int day = Math.min(recurring.dayOfMonth(), daysInMonth);
			LocalDate expenseDate = today.withDayOfMonth(day);
			expenseMapper.insertFromRecurring(userId, recurring, expenseDate);
			generated++;
		}
		return generated;
	}

}
