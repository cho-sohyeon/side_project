package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InterestTopicMapper {

	List<String> findAll();

	void deleteAll();

	void insert(@Param("topicCode") String topicCode);

}
