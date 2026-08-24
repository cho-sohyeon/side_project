package com.trendledger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.AuthResponse;
import com.trendledger.domain.UserLoginRequest;
import com.trendledger.domain.UserRegisterRequest;
import com.trendledger.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public AuthResponse register(@RequestBody UserRegisterRequest request) {
		return userService.register(request);
	}

	@PostMapping("/login")
	public AuthResponse login(@RequestBody UserLoginRequest request) {
		return userService.login(request);
	}

	@PostMapping("/logout")
	public void logout(@RequestHeader("X-Auth-Token") String token) {
		userService.logout(token);
	}

	@ExceptionHandler(IllegalStateException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public String handleIllegalState(IllegalStateException e) {
		return e.getMessage();
	}

}
