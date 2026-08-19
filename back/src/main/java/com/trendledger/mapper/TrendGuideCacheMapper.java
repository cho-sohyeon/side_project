package com.trendledger.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TrendGuideCacheMapper {

	Optional<String> findValidCardsJson(@Param("cacheKey") String cacheKey);

	void upsert(@Param("cacheKey") String cacheKey, @Param("tier") String tier, @Param("cardsJson") String cardsJson);

}
