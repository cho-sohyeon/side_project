package com.trendledger.domain;

public record UserLoginRequest(
		String username,
		String password
) {
}
