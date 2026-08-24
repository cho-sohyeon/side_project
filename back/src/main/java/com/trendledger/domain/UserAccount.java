package com.trendledger.domain;

import java.time.LocalDateTime;

public record UserAccount(
		Long userId,
		String username,
		String passwordHash,
		String nickname,
		LocalDateTime createdAt
) {
}
