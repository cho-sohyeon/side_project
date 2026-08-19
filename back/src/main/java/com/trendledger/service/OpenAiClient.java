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

	private static final String INSIGHT_SYSTEM_PROMPT = """
			너는 사용자의 소비/투자 프로필에 맞춰 뉴스를 재해석해주는 큐레이터다.
			뉴스 기사가 "이 사용자에게 왜 중요한지"를 문장이 아니라
			핵심 키워드/짧은 구(phrase) 형태로 압축해서 표현해라.

			규칙:
			- 완전한 문장(주어+서술어)으로 쓰지 말고, 명사구나 짧은 구로 끝내라.
			- 공백 포함 12자 이내로 써라.
			- 인스타그램 카드뉴스의 큰 타이틀처럼 강렬하고 한눈에 들어오게 써라.
			- 예시 형식: "공격투자 기회", "청약 골든타임", "ETF 손실 주의"
			- 다른 설명, 마침표, 따옴표 없이 구문 하나만 출력해라.
			""";

	@SuppressWarnings("unchecked")
	public String generatePersonalizedInsight(String title, String description, String tier,
			String investmentPropensityType, String spendingHabitType, String ageHouseholdType) {
		String userContext = """
				[사용자 프로필]
				절약 티어: %s
				투자 성향: %s
				소비습관 유형: %s
				연령대/가구유형: %s

				[뉴스 기사]
				제목: %s
				본문: %s
				""".formatted(tier, investmentPropensityType, spendingHabitType, ageHouseholdType, title, description);

		Map<String, Object> requestBody = Map.of(
				"model", "gpt-4o-mini",
				"messages", List.of(
						Map.of("role", "system", "content", INSIGHT_SYSTEM_PROMPT),
						Map.of("role", "user", "content", userContext)
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
