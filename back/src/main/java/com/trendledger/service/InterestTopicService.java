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

	public List<String> getSelectedTopics(Long userId) {
		return interestTopicMapper.findAll(userId);
	}

	public void saveTopics(Long userId, List<String> topicCodes) {
		interestTopicMapper.deleteAll(userId);
		topicCodes.forEach(code -> interestTopicMapper.insert(userId, code));
	}

}
