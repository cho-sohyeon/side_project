package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.trendledger.domain.SurveyResponseRecord;

@Mapper
public interface SurveyResponseMapper {

	void insertBatch(List<SurveyResponseRecord> records);

}
