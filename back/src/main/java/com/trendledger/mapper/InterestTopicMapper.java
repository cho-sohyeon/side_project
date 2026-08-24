package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InterestTopicMapper {

	List<String> findAll(@Param("userId") Long userId);

	void deleteAll(@Param("userId") Long userId);

	void insert(@Param("userId") Long userId, @Param("topicCode") String topicCode);

}
