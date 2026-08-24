package com.trendledger.domain;

public record PasswordChangeRequest(
		String currentPassword,
		String newPassword
) {
}
