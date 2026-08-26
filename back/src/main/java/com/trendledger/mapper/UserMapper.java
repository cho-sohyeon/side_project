package com.trendledger.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.UserAccount;

@Mapper
public interface UserMapper {

	Optional<UserAccount> findByUsername(@Param("username") String username);

	Optional<UserAccount> findById(@Param("userId") Long userId);

	long countAll();

	void insert(@Param("username") String username, @Param("passwordHash") String passwordHash,
			@Param("nickname") String nickname);

	void updateNickname(@Param("userId") Long userId, @Param("nickname") String nickname);

	void updatePassword(@Param("userId") Long userId, @Param("passwordHash") String passwordHash);

	void updateProfileImage(@Param("userId") Long userId, @Param("profileImage") String profileImage);

	void delete(@Param("userId") Long userId);

}
