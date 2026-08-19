package com.trendledger.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.ObjectMapper;

import com.trendledger.domain.NewsSearchResult;

@Component
public class NaverNewsClient {

	private final RestClient restClient;
	private final ObjectMapper objectMapper;

	public NaverNewsClient(
			@Value("${naver.client.id}") String clientId,
			@Value("${naver.client.secret}") String clientSecret,
			ObjectMapper objectMapper) {
		this.restClient = RestClient.builder()
				.baseUrl("https://naverapihub.apigw.ntruss.com/search/v1")
				.defaultHeader("X-NCP-APIGW-API-KEY-ID", clientId)
				.defaultHeader("X-NCP-APIGW-API-KEY", clientSecret)
				.build();
		this.objectMapper = objectMapper;
	}

	@SuppressWarnings("unchecked")
	public NewsSearchResult searchNews(String query, int count, String sort) {
		String rawBody = restClient.get()
				.uri(uriBuilder -> uriBuilder
						.path("/news")
						.queryParam("query", query)
						.queryParam("display", count)
						.queryParam("sort", sort)
						.build())
				.retrieve()
				.body(String.class);

		Map<String, Object> response = objectMapper.readValue(rawBody, Map.class);
		int total = (int) response.get("total");
		List<Map<String, String>> items = (List<Map<String, String>>) response.get("items");
		return new NewsSearchResult(total, items);
	}

}
