package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.SurveyAnswerRow;
import com.trendledger.domain.SurveyResponseRecord;

@Mapper
public interface SurveyResponseMapper {

	void insertBatch(List<SurveyResponseRecord> records);

	List<SurveyAnswerRow> findLatestAnswers(@Param("profileId") Long profileId);

	void deleteByProfileId(@Param("profileId") Long profileId);

}
