package com.trendledger.config;

import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.trendledger.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

	private final UserService userService;

	public AuthInterceptor(UserService userService) {
		this.userService = userService;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		// 브라우저의 CORS preflight(OPTIONS)는 X-Auth-Token 헤더를 싣지 않으므로 그대로 통과시켜야
		// 실제 요청(GET/POST 등)이 전송된다. 여기서 막으면 preflight 자체가 401로 실패해
		// 로그인 이후의 모든 인증된 요청이 브라우저 단에서 조용히 실패하게 된다.
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			return true;
		}

		String token = request.getHeader("X-Auth-Token");
		if (token == null || token.isBlank()) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return false;
		}

		Optional<Long> userId = userService.resolveUserId(token);
		if (userId.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return false;
		}

		request.setAttribute("userId", userId.get());
		return true;
	}

}
