package com.trendledger.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.CategoryBudget;

@Mapper
public interface CategoryBudgetMapper {

	List<CategoryBudget> findByYearMonth(@Param("userId") Long userId, @Param("yearMonth") String yearMonth);

	void upsert(@Param("userId") Long userId, @Param("yearMonth") String yearMonth,
			@Param("category") String category, @Param("targetAmount") BigDecimal targetAmount);

	void delete(@Param("userId") Long userId, @Param("yearMonth") String yearMonth, @Param("category") String category);

}
