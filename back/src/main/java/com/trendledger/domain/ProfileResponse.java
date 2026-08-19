package com.trendledger.domain;

public record ProfileResponse(
		boolean registered,
		ProfileDetail profile
) {
}
