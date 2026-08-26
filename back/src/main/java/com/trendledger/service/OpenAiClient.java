package com.trendledger.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.ObjectMapper;

import com.trendledger.domain.ChatMessage;
import com.trendledger.domain.ExpenseAnalyzeResponse;
import com.trendledger.domain.NewsInsight;

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
			너는 사용자의 소비/투자 프로필에 맞춰 뉴스를 재해석해서
			짧은 헤드라인과 실행 가능한 재테크 조언을 함께 주는 큐레이터다.
			아래 JSON 형식으로만 응답해라. 다른 설명 없이 JSON만 출력해라.

			{"headline": "핵심 키워드 구", "recommendation": "실행 가능한 조언 한 문장"}

			headline 규칙:
			- 완전한 문장(주어+서술어) 금지, 명사구나 짧은 구로 끝내라.
			- 공백 포함 12자 이내.
			- 인스타그램 카드뉴스의 큰 타이틀처럼 강렬하고 한눈에 들어오게.
			- 예시: "공격투자 기회", "청약 골든타임", "ETF 손실 주의"

			recommendation 규칙:
			- 이 사용자의 절약 티어/투자성향/소비습관/연령대·가구유형을 반영해서,
			  지금 이 뉴스와 관련해 무엇을 확인하거나 고려해보면 좋을지 실행 가능한 조언을 써라.
			- 가능하면 구체적인 금융상품 "유형"(예: 특판 정기예금, 배당형 ETF, 청약통장, 채권형 펀드 등)이나
			  행동(예: 청약 가점 확인, 예적금 금리 비교)을 언급해라.
			- 실제로 존재하는 특정 은행/증권사 상품명이나 금리 숫자를 지어내지 마라 — 상품 유형만 일반적으로 언급해라.
			- 투자 권유가 아닌 참고 정보이므로 단정적인 확신 표현은 피하고, 존댓말로 끝내라 (~해보세요, ~확인해보세요 등).
			- 공백 포함 45자 이내로 써라.
			""";

	@SuppressWarnings("unchecked")
	public NewsInsight generatePersonalizedInsight(String title, String description, String tier,
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
		String content = ((String) message.get("content")).trim();

		try {
			Map<String, Object> parsed = objectMapper.readValue(content, Map.class);
			String headline = (String) parsed.get("headline");
			String recommendation = (String) parsed.get("recommendation");
			return new NewsInsight(headline, recommendation);
		} catch (Exception e) {
			return new NewsInsight(content, null);
		}
	}

	private static final String CHAT_SYSTEM_PROMPT = """
			너는 TrendLedger 앱의 개인 재테크 상담 챗봇이다. 메신저 채팅처럼 대답해라.
			사용자마다 경제 상황, 저축 여력, 소비 습관, 투자 성향이 다르다는 것을 항상 감안해서
			아래 [사용자 재무 현황]에 실제로 근거해 답하고, 일반론만 늘어놓지 마라.

			태도:
			- 되묻지 말고 한 번에 답해라. 부족한 정보는 갖고 있는 데이터 안에서 합리적으로 가정하고,
			  그 가정을 짧게 밝힌 뒤 바로 구체적인 답을 줘라. "알려주세요", "말씀해 주세요" 같은
			  되묻는 질문으로 답을 끝내지 마라.
			- 애매하게 얼버무리지 말고, 이 사용자 상황이라면 구체적으로 "이렇게 해보세요"라고 먼저 제안해라.
			- 절약 티어/투자성향/소비습관에 맞는 구체적인 금액 배분(예: 여유자금의 몇 %), 우선순위, 행동 순서를
			  한 번의 답변 안에 여러 개 담아서 자신 있게 제시해라. 한 줄짜리 답보다 실행 가능한 항목을 여러 개 나열해라.
			- "~할 수도 있어요", "개인마다 다를 수 있어요" 같은 회피성 표현을 남발하지 마라. 결론부터 말해라.

			절대 넘지 말아야 할 선 (반드시 지켜라):
			- 실제로 존재하는 특정 은행/증권사 상품명, 실제 금리 숫자, 실제 수익률을 지어내지 마라 — 상품 "유형"만 언급해라.
			- "무조건 오릅니다", "손실 없이 보장됩니다" 같은 확정적 수익/원금보장 표현은 절대 쓰지 마라.
			- 실제 투자 자문/중개가 아닌 참고용 정보 제공이라는 선은 넘지 마라 (구체적 제안은 하되, 법적 보장처럼 말하지 마라).
			- 친근한 존댓말로 쓰되, 절대 긴 문단으로 쓰지 마라.
			- 답변은 "1)", "2)"처럼 번호가 붙는 항목 최대 4개로만 구성해라. 번호 없는 도입 문장은 쓰지 마라 — 바로 "1)"로 시작해라.
			- 각 번호 항목은 그 안에서 완결되게 써라. 이유나 예시(금액 등)를 붙이려면 반드시 같은 번호 안에서 한두 문장으로 끝내고,
			  절대 다음 번호로 넘어가면서 앞 항목 얘기를 이어가지 마라. 번호와 번호 사이에 걸치는 문장을 만들지 마라.
			  (예: "1) 매달 20%를 저축하세요. 20만원 중 4만원이에요." 이렇게 번호 하나 안에서 완결.)
			- 각 번호 항목은 공백 포함 60자 이내로 짧게 써라. 군더더기 설명 없이 핵심만 말해라.
			- 마크다운 문법을 쓰지 마라 (별표 굵게, #, - 목록 기호 금지). 순서를 나타낼 땐 "1)", "2)"처럼 텍스트로만 써라.
			- 되묻지 말고, 개수 제한이 있으니 가장 중요한 정보만 압축해서 담아라.
			""";

	@SuppressWarnings("unchecked")
	public String chat(String userContext, List<ChatMessage> history, String userMessage) {
		List<Map<String, String>> messages = new java.util.ArrayList<>();
		messages.add(Map.of("role", "system", "content", CHAT_SYSTEM_PROMPT + "\n\n" + userContext));
		for (ChatMessage m : history) {
			messages.add(Map.of("role", m.role(), "content", m.content()));
		}
		messages.add(Map.of("role", "user", "content", userMessage));

		Map<String, Object> requestBody = Map.of(
				"model", "gpt-4o-mini",
				"messages", messages
		);

		Map<String, Object> response = restClient.post()
				.uri("/chat/completions")
				.body(requestBody)
				.retrieve()
				.body(Map.class);

		List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
		Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
		return splitIntoBubbles(stripMarkdown(((String) message.get("content")).trim()));
	}

	private static final int MAX_CHAT_BUBBLES = 5;
	private static final java.util.regex.Pattern NUMBERED_ITEM = java.util.regex.Pattern.compile("(?=\\d\\)\\s)");

	/**
	 * 프롬프트로 "번호당 말풍선 하나"를 지시해도 모델이 가끔 항목과 예시/이유를 다음 번호로
	 * 걸쳐서 이어 쓰거나, 빈 줄을 엉뚱한 곳에 넣는다. 프론트엔드가 빈 줄(연속 개행) 기준으로
	 * 말풍선을 나누므로, "1)", "2)"... 번호 마커 위치를 기준으로 서버가 직접 말풍선 경계를
	 * 다시 잘라서 항상 번호당 하나의 말풍선이 되도록 보장한다. 번호가 없는 응답은 그대로 둔다.
	 */
	private String splitIntoBubbles(String text) {
		String[] parts = NUMBERED_ITEM.split(text);
		List<String> bubbles = new java.util.ArrayList<>();
		for (String part : parts) {
			String trimmed = part.trim();
			if (!trimmed.isEmpty()) {
				bubbles.add(trimmed);
			}
		}
		if (bubbles.size() <= 1) {
			return text;
		}
		if (bubbles.size() > MAX_CHAT_BUBBLES) {
			List<String> overflow = bubbles.subList(MAX_CHAT_BUBBLES - 1, bubbles.size());
			String mergedLast = String.join(" ", overflow);
			bubbles = new java.util.ArrayList<>(bubbles.subList(0, MAX_CHAT_BUBBLES - 1));
			bubbles.add(mergedLast);
		}
		return String.join("\n\n", bubbles);
	}

	/**
	 * 프롬프트로 마크다운을 쓰지 말라고 지시해도 모델이 종종 **굵게**, # 제목, - 목록 기호를 섞어 쓴다.
	 * 플레인 텍스트 말풍선에 그대로 노출되면 별표가 그대로 보이므로 후처리로 제거한다.
	 */
	private String stripMarkdown(String text) {
		return text
				.replaceAll("\\*\\*(.+?)\\*\\*", "$1")
				.replaceAll("(?m)^#{1,6}\\s*", "")
				.replaceAll("(?m)^[-*]\\s+", "");
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
