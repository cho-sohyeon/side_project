package com.trendledger.domain;

import java.math.BigDecimal;
import java.util.List;

public record TrendGuideResponse(
		String tier,
		BigDecimal savingsRate,
		boolean profileRegistered,
		String profileGuideMessage,
		List<NewsCard> cards
) {
}
