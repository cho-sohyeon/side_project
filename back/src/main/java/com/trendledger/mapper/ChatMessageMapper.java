package com.trendledger.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.trendledger.domain.ChatMessage;

@Mapper
public interface ChatMessageMapper {

	void insert(@Param("userId") Long userId, @Param("role") String role, @Param("content") String content);

	List<ChatMessage> findByUser(@Param("userId") Long userId);

	List<ChatMessage> findRecentByUser(@Param("userId") Long userId, @Param("limit") int limit);

	void deleteAllByUser(@Param("userId") Long userId);

}
