package com.trendledger.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class SurveyTypeCalculator {

	private static final List<String> SPENDING_HABIT_PRIORITY = List.of("FRUGAL", "PLANNED", "IMPULSIVE");
	private static final Map<String, String> SPENDING_HABIT_OPTION_MAP = Map.of(
			"A", "PLANNED",
			"B", "IMPULSIVE",
			"C", "FRUGAL"
	);
	private static final Map<String, String> INVESTMENT_OPTION_MAP = Map.of(
			"A", "CONSERVATIVE",
			"B", "NEUTRAL",
			"C", "AGGRESSIVE"
	);

	public String calculateSpendingHabitType(List<String> answers) {
		return calculateByMajority(answers, SPENDING_HABIT_OPTION_MAP, SPENDING_HABIT_PRIORITY);
	}

	public String calculateInvestmentPropensityType(List<String> answers) {
		Map<String, Long> counts = countByType(answers, INVESTMENT_OPTION_MAP);
		long max = counts.values().stream().mapToLong(Long::longValue).max().orElse(0);
		List<String> topTypes = counts.entrySet().stream()
				.filter(entry -> entry.getValue() == max)
				.map(Map.Entry::getKey)
				.toList();
		return topTypes.size() == 1 ? topTypes.get(0) : "NEUTRAL";
	}

	private String calculateByMajority(List<String> answers, Map<String, String> optionMap, List<String> tieBreakPriority) {
		Map<String, Long> counts = countByType(answers, optionMap);
		long max = counts.values().stream().mapToLong(Long::longValue).max().orElse(0);
		return tieBreakPriority.stream()
				.filter(type -> counts.getOrDefault(type, 0L) == max)
				.findFirst()
				.orElse(tieBreakPriority.get(0));
	}

	private Map<String, Long> countByType(List<String> answers, Map<String, String> optionMap) {
		return answers.stream()
				.map(optionMap::get)
				.collect(Collectors.groupingBy(type -> type, Collectors.counting()));
	}

}
