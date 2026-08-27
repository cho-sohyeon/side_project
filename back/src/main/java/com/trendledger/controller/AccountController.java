package com.trendledger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.AccountDeleteRequest;
import com.trendledger.domain.AuthResponse;
import com.trendledger.domain.NicknameUpdateRequest;
import com.trendledger.domain.PasswordChangeRequest;
import com.trendledger.domain.ProfileImageUpdateRequest;
import com.trendledger.service.UserService;

@RestController
@RequestMapping("/api/account")
public class AccountController {

	private final UserService userService;

	public AccountController(UserService userService) {
		this.userService = userService;
	}

	@PutMapping("/nickname")
	public String updateNickname(@RequestAttribute("userId") Long userId, @RequestBody NicknameUpdateRequest request) {
		return userService.updateNickname(userId, request.nickname());
	}

	@PutMapping("/password")
	public AuthResponse changePassword(@RequestAttribute("userId") Long userId, @RequestBody PasswordChangeRequest request) {
		return userService.changePassword(userId, request.currentPassword(), request.newPassword());
	}

	@PutMapping("/profile-image")
	public void updateProfileImage(@RequestAttribute("userId") Long userId, @RequestBody ProfileImageUpdateRequest request) {
		userService.updateProfileImage(userId, request.profileImage());
	}

	@DeleteMapping
	public void deleteAccount(@RequestAttribute("userId") Long userId, @RequestBody AccountDeleteRequest request) {
		userService.deleteAccount(userId, request.password());
	}

	@ExceptionHandler(IllegalStateException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public String handleIllegalState(IllegalStateException e) {
		return e.getMessage();
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleInvalidArgument(IllegalArgumentException e) {
		return e.getMessage();
	}

}
