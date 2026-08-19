package com.trendledger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.trendledger.domain.ProfileRegisterRequest;
import com.trendledger.domain.ProfileResponse;
import com.trendledger.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

	private final ProfileService profileService;

	public ProfileController(ProfileService profileService) {
		this.profileService = profileService;
	}

	@GetMapping
	public ProfileResponse getProfile() {
		return profileService.getProfile()
				.map(profile -> new ProfileResponse(
						true,
						profile,
						profileService.getLatestAnswers(profile.profileId(), "SPENDING_HABIT", profileService.spendingHabitQuestionCodes()),
						profileService.getLatestAnswers(profile.profileId(), "INVESTMENT_PROPENSITY", profileService.investmentQuestionCodes())
				))
				.orElse(new ProfileResponse(false, null, null, null));
	}

	@PostMapping
	public void register(@RequestBody ProfileRegisterRequest request) {
		profileService.register(request);
	}

	@PutMapping
	public void update(@RequestBody ProfileRegisterRequest request) {
		profileService.update(request);
	}

	@ExceptionHandler(IllegalStateException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public String handleIllegalState(IllegalStateException e) {
		return e.getMessage();
	}

}
