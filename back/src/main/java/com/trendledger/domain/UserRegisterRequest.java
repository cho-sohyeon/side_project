package com.trendledger.domain;

public record UserRegisterRequest(
		String username,
		String password,
		String nickname
) {
}
