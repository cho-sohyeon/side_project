package com.trendledger.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.domain.FilterPreset;
import com.trendledger.domain.FilterPresetSaveRequest;
import com.trendledger.mapper.FilterPresetMapper;

@Service
public class FilterPresetService {

	private final FilterPresetMapper filterPresetMapper;

	public FilterPresetService(FilterPresetMapper filterPresetMapper) {
		this.filterPresetMapper = filterPresetMapper;
	}

	public void save(FilterPresetSaveRequest request) {
		filterPresetMapper.insert(request);
	}

	public List<FilterPreset> findAll() {
		return filterPresetMapper.findAll();
	}

}
