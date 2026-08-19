package com.trendledger.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.CategorySummary;
import com.trendledger.domain.ExpenseStatRequest;
import com.trendledger.domain.MonthlySummary;

@Mapper
public interface ExpenseStatMapper {

	List<CategorySummary> findCategorySummaries(ExpenseStatRequest request);

	List<MonthlySummary> findMonthlySummaries(ExpenseStatRequest request);

	BigDecimal findMonthlyTotal(@Param("yearMonth") String yearMonth);

}
