package com.trendledger.service;

import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trendledger.domain.AuthResponse;
import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.UserAccount;
import com.trendledger.domain.UserLoginRequest;
import com.trendledger.domain.UserRegisterRequest;
import com.trendledger.mapper.BudgetGoalMapper;
import com.trendledger.mapper.ChatMessageMapper;
import com.trendledger.mapper.ExpenseMapper;
import com.trendledger.mapper.FilterPresetMapper;
import com.trendledger.mapper.InterestTopicMapper;
import com.trendledger.mapper.ProfileMapper;
import com.trendledger.mapper.SessionMapper;
import com.trendledger.mapper.SurveyResponseMapper;
import com.trendledger.mapper.UserMapper;

@Service
public class UserService {

	private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9]{4,20}$");
	private static final int PASSWORD_MIN_LENGTH = 8;
	private static final int NICKNAME_MAX_LENGTH = 20;

	private final UserMapper userMapper;
	private final SessionMapper sessionMapper;
	private final PasswordEncoder passwordEncoder;
	private final ExpenseMapper expenseMapper;
	private final BudgetGoalMapper budgetGoalMapper;
	private final FilterPresetMapper filterPresetMapper;
	private final ProfileMapper profileMapper;
	private final SurveyResponseMapper surveyResponseMapper;
	private final InterestTopicMapper interestTopicMapper;
	private final ChatMessageMapper chatMessageMapper;

	public UserService(UserMapper userMapper, SessionMapper sessionMapper, PasswordEncoder passwordEncoder,
			ExpenseMapper expenseMapper, BudgetGoalMapper budgetGoalMapper, FilterPresetMapper filterPresetMapper,
			ProfileMapper profileMapper, SurveyResponseMapper surveyResponseMapper,
			InterestTopicMapper interestTopicMapper, ChatMessageMapper chatMessageMapper) {
		this.userMapper = userMapper;
		this.sessionMapper = sessionMapper;
		this.passwordEncoder = passwordEncoder;
		this.expenseMapper = expenseMapper;
		this.budgetGoalMapper = budgetGoalMapper;
		this.filterPresetMapper = filterPresetMapper;
		this.profileMapper = profileMapper;
		this.surveyResponseMapper = surveyResponseMapper;
		this.interestTopicMapper = interestTopicMapper;
		this.chatMessageMapper = chatMessageMapper;
	}

	public AuthResponse register(UserRegisterRequest request) {
		validate(request);

		if (userMapper.findByUsername(request.username()).isPresent()) {
			throw new IllegalStateException("이미 사용 중인 아이디입니다.");
		}

		boolean isFirstUser = userMapper.countAll() == 0;
		String passwordHash = passwordEncoder.encode(request.password());
		userMapper.insert(request.username(), passwordHash, request.nickname());
		UserAccount created = userMapper.findByUsername(request.username())
				.orElseThrow(() -> new IllegalStateException("회원가입에 실패했습니다."));

		if (isFirstUser) {
			claimOrphanedData(created.userId());
		}

		String token = createSession(created.userId());
		return new AuthResponse(token, created.nickname(), created.profileImage(), created.role());
	}

	public AuthResponse login(UserLoginRequest request) {
		UserAccount account = userMapper.findByUsername(request.username())
				.orElseThrow(() -> new IllegalStateException("아이디 또는 비밀번호가 올바르지 않습니다."));
		if (!passwordEncoder.matches(request.password(), account.passwordHash())) {
			throw new IllegalStateException("아이디 또는 비밀번호가 올바르지 않습니다.");
		}
		String token = createSession(account.userId());
		return new AuthResponse(token, account.nickname(), account.profileImage(), account.role());
	}

	public void logout(String token) {
		sessionMapper.deleteByToken(token);
	}

	public String updateNickname(Long userId, String nickname) {
		if (nickname == null || nickname.isBlank() || nickname.length() > NICKNAME_MAX_LENGTH) {
			throw new IllegalStateException("닉네임은 1~" + NICKNAME_MAX_LENGTH + "자로 입력해주세요.");
		}
		userMapper.updateNickname(userId, nickname);
		return nickname;
	}

	public AuthResponse changePassword(Long userId, String currentPassword, String newPassword) {
		UserAccount account = userMapper.findById(userId)
				.orElseThrow(() -> new IllegalStateException("계정을 찾을 수 없습니다."));
		if (!passwordEncoder.matches(currentPassword, account.passwordHash())) {
			throw new IllegalStateException("현재 비밀번호가 일치하지 않습니다.");
		}
		if (newPassword == null || newPassword.length() < PASSWORD_MIN_LENGTH) {
			throw new IllegalStateException("새 비밀번호는 8자 이상이어야 합니다.");
		}
		userMapper.updatePassword(userId, passwordEncoder.encode(newPassword));

		// 비밀번호가 바뀌었으니 다른 기기/브라우저에 남아있던 기존 로그인은 모두 무효화하고,
		// 지금 이 세션은 새 토큰을 발급해 로그아웃 없이 이어가게 한다.
		sessionMapper.deleteAllByUser(userId);
		String token = createSession(userId);
		return new AuthResponse(token, account.nickname(), account.profileImage(), account.role());
	}

	private static final int MAX_PROFILE_IMAGE_LENGTH = 700_000; // base64 기준 약 500KB 원본 이미지 상한

	public void updateProfileImage(Long userId, String profileImageBase64) {
		if (profileImageBase64 != null && profileImageBase64.length() > MAX_PROFILE_IMAGE_LENGTH) {
			throw new IllegalStateException("이미지 용량이 너무 큽니다. 더 작은 이미지를 사용해주세요.");
		}
		userMapper.updateProfileImage(userId, profileImageBase64);
	}

	/**
	 * 계정과 그 계정이 소유한 모든 데이터(지출, 프로필, 설문, 목표, 프리셋, 관심토픽)를 영구 삭제한다.
	 */
	public void deleteAccount(Long userId, String password) {
		UserAccount account = userMapper.findById(userId)
				.orElseThrow(() -> new IllegalStateException("계정을 찾을 수 없습니다."));
		if (!passwordEncoder.matches(password, account.passwordHash())) {
			throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
		}

		Optional<ProfileDetail> profile = profileMapper.findByUserId(userId);
		profile.ifPresent(p -> surveyResponseMapper.deleteByProfileId(p.profileId()));
		profileMapper.deleteByUserId(userId);

		expenseMapper.deleteAllByUser(userId);
		budgetGoalMapper.deleteAllByUser(userId);
		filterPresetMapper.deleteAllByUser(userId);
		interestTopicMapper.deleteAll(userId);
		chatMessageMapper.deleteAllByUser(userId);
		sessionMapper.deleteAllByUser(userId);
		userMapper.delete(userId);
	}

	public Optional<Long> resolveUserId(String token) {
		return sessionMapper.findUserIdByToken(token);
	}

	public void requireAdmin(Long userId) {
		boolean isAdmin = userMapper.findById(userId).map(UserAccount::isAdmin).orElse(false);
		if (!isAdmin) {
			throw new SecurityException("관리자만 접근할 수 있습니다.");
		}
	}

	private void validate(UserRegisterRequest request) {
		if (request.username() == null || !USERNAME_PATTERN.matcher(request.username()).matches()) {
			throw new IllegalStateException("아이디는 영문/숫자 4~20자로 입력해주세요.");
		}
		if (request.password() == null || request.password().length() < PASSWORD_MIN_LENGTH) {
			throw new IllegalStateException("비밀번호는 8자 이상이어야 합니다.");
		}
		if (request.nickname() == null || request.nickname().isBlank() || request.nickname().length() > NICKNAME_MAX_LENGTH) {
			throw new IllegalStateException("닉네임은 1~" + NICKNAME_MAX_LENGTH + "자로 입력해주세요.");
		}
	}

	private String createSession(Long userId) {
		String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
		sessionMapper.insert(token, userId);
		return token;
	}

	/**
	 * 멀티유저 전환 이전에 쌓인, 소유자가 없던(user_id IS NULL) 데이터를
	 * 최초 가입자에게 자동으로 귀속시킨다.
	 */
	private void claimOrphanedData(Long userId) {
		expenseMapper.claimOrphaned(userId);
		budgetGoalMapper.claimOrphaned(userId);
		filterPresetMapper.claimOrphaned(userId);
		profileMapper.claimOrphaned(userId);
	}

}
