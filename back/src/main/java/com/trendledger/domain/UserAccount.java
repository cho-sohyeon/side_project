package com.trendledger.domain;

import java.time.LocalDateTime;

public record UserAccount(
		Long userId,
		String username,
		String passwordHash,
		String nickname,
		String profileImage,
		String role,
		LocalDateTime createdAt
) {
	public boolean isAdmin() {
		return "ADMIN".equals(role);
	}
}
