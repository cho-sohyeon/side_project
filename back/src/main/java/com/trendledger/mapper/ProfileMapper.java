package com.trendledger.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.trendledger.domain.ProfileDetail;
import com.trendledger.domain.ProfileUpsertRecord;

@Mapper
public interface ProfileMapper {

	Optional<ProfileDetail> findOne();

	void insert(ProfileUpsertRecord record);

	void update(ProfileUpsertRecord record);

}
