package com.trendledger.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TierCalculator {

	private final BigDecimal silverThreshold;
	private final BigDecimal goldThreshold;
	private final BigDecimal platinumThreshold;

	public TierCalculator(
			@Value("${savings.tier.silver-threshold}") BigDecimal silverThreshold,
			@Value("${savings.tier.gold-threshold}") BigDecimal goldThreshold,
			@Value("${savings.tier.platinum-threshold}") BigDecimal platinumThreshold) {
		this.silverThreshold = silverThreshold;
		this.goldThreshold = goldThreshold;
		this.platinumThreshold = platinumThreshold;
	}

	public BigDecimal calculateSavingsRate(BigDecimal baseline, BigDecimal actual) {
		if (baseline == null || baseline.compareTo(BigDecimal.ZERO) <= 0) {
			return BigDecimal.ZERO;
		}
		return baseline.subtract(actual).divide(baseline, 4, RoundingMode.HALF_UP);
	}

	public String calculateTier(BigDecimal savingsRate) {
		if (savingsRate.compareTo(BigDecimal.ZERO) < 0) {
			return "NONE";
		}
		if (savingsRate.compareTo(platinumThreshold) >= 0) {
			return "PLATINUM";
		}
		if (savingsRate.compareTo(goldThreshold) >= 0) {
			return "GOLD";
		}
		if (savingsRate.compareTo(silverThreshold) >= 0) {
			return "SILVER";
		}
		return "BRONZE";
	}

}
