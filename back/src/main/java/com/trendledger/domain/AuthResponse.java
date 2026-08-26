package com.trendledger.domain;

public record AuthResponse(
		String token,
		String nickname,
		String profileImage,
		String role
) {
}
