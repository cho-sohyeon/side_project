package com.trendledger.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.ObjectMapper;

import com.trendledger.domain.ExpenseAnalyzeResponse;

@Component
public class OpenAiClient {

	private static final String SYSTEM_PROMPT = """
			너는 소비 지출 내역을 분석하는 어시스턴트다.
			사용자가 입력한 지출 내역 한 줄을 보고 아래 JSON 형식으로만 응답해라.
			다른 설명 없이 JSON만 출력해라.

			{"category": "카테고리명", "isTrendRelated": true 또는 false}

			category는 "식비", "교통", "쇼핑", "주거", "여가", "금융/투자", "기타" 중 하나를 사용해라.
			isTrendRelated는 지출이 부동산, 주식, 금융 트렌드와 관련 있으면 true, 아니면 false로 해라.
			""";

	private final RestClient restClient;
	private final ObjectMapper objectMapper;

	public OpenAiClient(@Value("${openai.api.key}") String apiKey, ObjectMapper objectMapper) {
		this.restClient = RestClient.builder()
				.baseUrl("https://api.openai.com/v1")
				.defaultHeader("Authorization", "Bearer " + apiKey)
				.build();
		this.objectMapper = objectMapper;
	}

	@SuppressWarnings("unchecked")
	public ExpenseAnalyzeResponse classify(String expenseDesc) {
		Map<String, Object> requestBody = Map.of(
				"model", "gpt-4o-mini",
				"messages", List.of(
						Map.of("role", "system", "content", SYSTEM_PROMPT),
						Map.of("role", "user", "content", expenseDesc)
				),
				"response_format", Map.of("type", "json_object")
		);

		Map<String, Object> response = restClient.post()
				.uri("/chat/completions")
				.body(requestBody)
				.retrieve()
				.body(Map.class);

		List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
		Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
		String content = (String) message.get("content");

		return parse(content);
	}

	@SuppressWarnings("unchecked")
	public String summarizeNews(String title, String description) {
		Map<String, Object> requestBody = Map.of(
				"model", "gpt-4o-mini",
				"messages", List.of(
						Map.of("role", "system", "content",
								"너는 뉴스 기사를 한 문장으로 요약하는 어시스턴트다. 제목과 본문 일부를 보고 핵심을 한 문장으로 요약해라. 다른 설명 없이 요약 문장만 출력해라."),
						Map.of("role", "user", "content", "제목: " + title + "\n본문: " + description)
				)
		);

		Map<String, Object> response = restClient.post()
				.uri("/chat/completions")
				.body(requestBody)
				.retrieve()
				.body(Map.class);

		List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
		Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
		return ((String) message.get("content")).trim();
	}

	private ExpenseAnalyzeResponse parse(String json) {
		try {
			Map<String, Object> parsed = objectMapper.readValue(json, Map.class);
			String category = (String) parsed.get("category");
			boolean isTrendRelated = Boolean.TRUE.equals(parsed.get("isTrendRelated"));
			return new ExpenseAnalyzeResponse(category, isTrendRelated);
		} catch (Exception e) {
			throw new IllegalStateException("OpenAI 응답 파싱 실패: " + json, e);
		}
	}

}
