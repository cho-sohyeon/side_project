package com.trendledger.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.TrendGuideResponse;
import com.trendledger.service.TrendGuideService;

@RestController
@RequestMapping("/api/trend-guide")
public class TrendGuideController {

	private final TrendGuideService trendGuideService;

	public TrendGuideController(TrendGuideService trendGuideService) {
		this.trendGuideService = trendGuideService;
	}

	@GetMapping
	public TrendGuideResponse getGuide() {
		return trendGuideService.getGuide();
	}

}
