package com.trendledger.domain;

public record NewsCard(
		String title,
		String summary,
		String url,
		String imageUrl,
		String recommendation
) {
}
