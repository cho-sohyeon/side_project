package com.trendledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.AdminUserSummary;
import com.trendledger.mapper.AdminMapper;
import com.trendledger.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final UserService userService;
	private final AdminMapper adminMapper;

	public AdminController(UserService userService, AdminMapper adminMapper) {
		this.userService = userService;
		this.adminMapper = adminMapper;
	}

	@GetMapping("/users")
	public List<AdminUserSummary> getUserSummaries(@RequestAttribute("userId") Long userId) {
		userService.requireAdmin(userId);
		return adminMapper.findUserSummaries();
	}

	@ExceptionHandler(SecurityException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public String handleForbidden(SecurityException e) {
		return e.getMessage();
	}

}
