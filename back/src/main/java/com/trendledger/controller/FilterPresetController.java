package com.trendledger.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.FilterPreset;
import com.trendledger.domain.FilterPresetSaveRequest;
import com.trendledger.service.FilterPresetService;

@RestController
@RequestMapping("/api/filter-presets")
public class FilterPresetController {

	private final FilterPresetService filterPresetService;

	public FilterPresetController(FilterPresetService filterPresetService) {
		this.filterPresetService = filterPresetService;
	}

	@PostMapping
	public void save(@RequestBody FilterPresetSaveRequest request) {
		filterPresetService.save(request);
	}

	@GetMapping
	public List<FilterPreset> list() {
		return filterPresetService.findAll();
	}

}
