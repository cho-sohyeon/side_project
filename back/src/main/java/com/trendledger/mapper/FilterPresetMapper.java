package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.trendledger.domain.FilterPreset;
import com.trendledger.domain.FilterPresetSaveRequest;

@Mapper
public interface FilterPresetMapper {

	void insert(FilterPresetSaveRequest request);

	List<FilterPreset> findAll();

}
