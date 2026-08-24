package com.trendledger.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SessionMapper {

	void insert(@Param("token") String token, @Param("userId") Long userId);

	Optional<Long> findUserIdByToken(@Param("token") String token);

	void deleteByToken(@Param("token") String token);

	void deleteAllByUser(@Param("userId") Long userId);

}
