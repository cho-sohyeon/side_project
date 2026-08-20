package com.trendledger.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.service.InterestTopicService;

@RestController
@RequestMapping("/api/interests")
public class InterestTopicController {

	private final InterestTopicService interestTopicService;

	public InterestTopicController(InterestTopicService interestTopicService) {
		this.interestTopicService = interestTopicService;
	}

	@GetMapping
	public List<String> getSelectedTopics() {
		return interestTopicService.getSelectedTopics();
	}

	@PutMapping
	public void saveTopics(@RequestBody List<String> topicCodes) {
		interestTopicService.saveTopics(topicCodes);
	}

}
