package com.trendledger.domain;

import java.time.LocalDateTime;

public record ChatMessage(
		Long messageId,
		String role,
		String content,
		LocalDateTime createdAt
) {
}
