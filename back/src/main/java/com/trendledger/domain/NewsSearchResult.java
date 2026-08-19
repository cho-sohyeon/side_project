package com.trendledger.domain;

import java.util.List;
import java.util.Map;

public record NewsSearchResult(
		int total,
		List<Map<String, String>> items
) {
}
