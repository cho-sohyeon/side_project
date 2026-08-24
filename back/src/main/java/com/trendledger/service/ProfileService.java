package com.trendledger.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.ProfileRegisterRequest;
import com.trendledger.domain.ProfileUpsertRecord;
import com.trendledger.domain.SurveyAnswerRow;
import com.trendledger.domain.SurveyResponseRecord;
import com.trendledger.mapper.ProfileMapper;
import com.trendledger.mapper.SurveyResponseMapper;

@Service
public class ProfileService {

	private static final List<String> SPENDING_HABIT_QUESTION_CODES = List.of("Q1", "Q2", "Q3", "Q4", "Q5");
	private static final List<String> INVESTMENT_QUESTION_CODES = List.of("Q1", "Q2", "Q3");

	private final ProfileMapper profileMapper;
	private final SurveyResponseMapper surveyResponseMapper;
	private final SurveyTypeCalculator surveyTypeCalculator;

	public ProfileService(ProfileMapper profileMapper, SurveyResponseMapper surveyResponseMapper,
			SurveyTypeCalculator surveyTypeCalculator) {
		this.profileMapper = profileMapper;
		this.surveyResponseMapper = surveyResponseMapper;
		this.surveyTypeCalculator = surveyTypeCalculator;
	}

	public Optional<ProfileDetail> getProfile(Long userId) {
		return profileMapper.findByUserId(userId);
	}

	public List<String> getLatestAnswers(Long profileId, String surveyType, List<String> questionCodes) {
		Map<String, String> byQuestionCode = surveyResponseMapper.findLatestAnswers(profileId).stream()
				.filter(row -> row.surveyType().equals(surveyType))
				.collect(java.util.stream.Collectors.toMap(SurveyAnswerRow::questionCode, SurveyAnswerRow::selectedOption));
		return questionCodes.stream().map(byQuestionCode::get).toList();
	}

	public List<String> spendingHabitQuestionCodes() {
		return SPENDING_HABIT_QUESTION_CODES;
	}

	public List<String> investmentQuestionCodes() {
		return INVESTMENT_QUESTION_CODES;
	}

	public void register(Long userId, ProfileRegisterRequest request) {
		if (profileMapper.findByUserId(userId).isPresent()) {
			throw new IllegalStateException("이미 프로필이 등록되어 있습니다.");
		}
		upsert(userId, null, request);
	}

	public void update(Long userId, ProfileRegisterRequest request) {
		ProfileDetail existing = profileMapper.findByUserId(userId)
				.orElseThrow(() -> new IllegalStateException("등록된 프로필이 없습니다."));
		upsert(userId, existing.profileId(), request);
	}

	private void upsert(Long userId, Long profileId, ProfileRegisterRequest request) {
		String spendingHabitType = surveyTypeCalculator.calculateSpendingHabitType(request.spendingHabitAnswers());
		String investmentPropensityType = surveyTypeCalculator.calculateInvestmentPropensityType(request.investmentAnswers());

		ProfileUpsertRecord record = new ProfileUpsertRecord(
				profileId,
				userId,
				request.ageHouseholdType(),
				request.hasSubscriptionAccount(),
				request.livingType(),
				spendingHabitType,
				investmentPropensityType
		);

		if (profileId == null) {
			profileMapper.insert(record);
		} else {
			profileMapper.update(record);
		}

		Long savedProfileId = profileMapper.findByUserId(userId)
				.orElseThrow(() -> new IllegalStateException("프로필 저장에 실패했습니다."))
				.profileId();

		saveSurveyResponses(savedProfileId, "SPENDING_HABIT", SPENDING_HABIT_QUESTION_CODES, request.spendingHabitAnswers());
		saveSurveyResponses(savedProfileId, "INVESTMENT_PROPENSITY", INVESTMENT_QUESTION_CODES, request.investmentAnswers());
	}

	private void saveSurveyResponses(Long profileId, String surveyType, List<String> questionCodes, List<String> answers) {
		List<SurveyResponseRecord> records = IntStream.range(0, questionCodes.size())
				.mapToObj(i -> new SurveyResponseRecord(
						profileId,
						surveyType,
						1,
						questionCodes.get(i),
						answers.get(i)
				))
				.toList();
		surveyResponseMapper.insertBatch(records);
	}

}
