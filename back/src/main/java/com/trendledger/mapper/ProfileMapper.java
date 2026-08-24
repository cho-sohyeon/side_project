package com.trendledger.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.ProfileUpsertRecord;

@Mapper
public interface ProfileMapper {

	Optional<ProfileDetail> findByUserId(@Param("userId") Long userId);

	void insert(ProfileUpsertRecord record);

	void update(ProfileUpsertRecord record);

	void claimOrphaned(@Param("userId") Long userId);

	void deleteByUserId(@Param("userId") Long userId);

}
