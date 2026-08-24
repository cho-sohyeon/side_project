package com.trendledger.util;

import java.math.BigDecimal;

public final class AmountValidator {

	// DB 컬럼이 NUMERIC(15, 2)이므로 정수부 최대 13자리까지 저장 가능하다.
	private static final BigDecimal MAX_AMOUNT = new BigDecimal("9999999999999.99");

	private AmountValidator() {
	}

	public static void validate(BigDecimal amount) {
		if (amount == null) {
			throw new IllegalArgumentException("금액을 입력해주세요.");
		}
		if (amount.abs().compareTo(MAX_AMOUNT) > 0) {
			throw new IllegalArgumentException("금액은 9,999,999,999,999.99원을 넘을 수 없습니다.");
		}
	}

}
