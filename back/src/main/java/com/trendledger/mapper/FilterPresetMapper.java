package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.FilterPreset;
import com.trendledger.domain.FilterPresetSaveRequest;

@Mapper
public interface FilterPresetMapper {

	void insert(@Param("userId") Long userId, @Param("request") FilterPresetSaveRequest request);

	List<FilterPreset> findAll(@Param("userId") Long userId);

	void claimOrphaned(@Param("userId") Long userId);

	void deleteAllByUser(@Param("userId") Long userId);

}
