package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.trendledger.domain.AdminUserSummary;

@Mapper
public interface AdminMapper {

	List<AdminUserSummary> findUserSummaries();

}
