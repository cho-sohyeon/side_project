package com.trendledger.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.trendledger.mapper.InterestTopicMapper;

@Service
public class InterestTopicService {

	private final InterestTopicMapper interestTopicMapper;

	public InterestTopicService(InterestTopicMapper interestTopicMapper) {
		this.interestTopicMapper = interestTopicMapper;
	}

	public List<String> getSelectedTopics() {
		return interestTopicMapper.findAll();
	}

	public void saveTopics(List<String> topicCodes) {
		interestTopicMapper.deleteAll();
		topicCodes.forEach(interestTopicMapper::insert);
	}

}
