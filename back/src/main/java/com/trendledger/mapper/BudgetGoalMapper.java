package com.trendledger.mapper;

import java.math.BigDecimal;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.BudgetGoal;

@Mapper
public interface BudgetGoalMapper {

	Optional<BudgetGoal> findByYearMonth(@Param("yearMonth") String yearMonth);

	void upsert(@Param("yearMonth") String yearMonth, @Param("targetAmount") BigDecimal targetAmount);

}
