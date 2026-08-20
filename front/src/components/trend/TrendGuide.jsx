import { useEffect, useState } from 'react'
import TierBadge from './TierBadge'
import NewsCardList from './NewsCardList'
import { getTrendGuide, getTodayIssues, getInterestIssues } from '../../api/trendGuideApi'
import { getProfile } from '../../api/profileApi'
import { AGE_HOUSEHOLD_OPTIONS, LIVING_TYPE_OPTIONS } from '../profile/BasicInfoForm'
import InterestTopicSettings from './InterestTopicSettings'

const SPENDING_HABIT_LABELS = {
  PLANNED: '계획소비형',
  IMPULSIVE: '충동소비형',
  FRUGAL: '절약형',
}

const INVESTMENT_LABELS = {
  CONSERVATIVE: '안정형',
  NEUTRAL: '중립형',
  AGGRESSIVE: '공격형',
}

function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

function TrendGuide({ onGoToProfile }) {
  const [guide, setGuide] = useState(null)
  const [profile, setProfile] = useState(null)
  const [todayCards, setTodayCards] = useState([])
  const [interestCards, setInterestCards] = useState([])
  const [error, setError] = useState(null)

  function refreshInterestCards() {
    getInterestIssues()
      .then(setInterestCards)
      .catch(() => setInterestCards([]))
  }

  useEffect(() => {
    getTrendGuide()
      .then(setGuide)
      .catch((e) => setError(e.message))
    getProfile()
      .then((res) => setProfile(res.registered ? res.profile : null))
      .catch(() => setProfile(null))
    getTodayIssues()
      .then(setTodayCards)
      .catch(() => setTodayCards([]))
    refreshInterestCards()
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!guide) {
    return <p className="muted">불러오는 중...</p>
  }

  const chips = profile
    ? [
        labelOf(AGE_HOUSEHOLD_OPTIONS, profile.ageHouseholdType),
        labelOf(LIVING_TYPE_OPTIONS, profile.livingType),
        SPENDING_HABIT_LABELS[profile.spendingHabitType],
        INVESTMENT_LABELS[profile.investmentPropensityType],
      ].filter(Boolean)
    : []

  return (
    <section className="section">
      <h2>투자 트렌드</h2>

      {!guide.profileRegistered && (
        <div className="banner-warning">
          <p>{guide.profileGuideMessage}</p>
          {onGoToProfile && (
            <button type="button" className="btn" onClick={onGoToProfile}>
              프로필 등록하러 가기
            </button>
          )}
        </div>
      )}

      <TierBadge tier={guide.tier} savingsRate={guide.savingsRate} />

      {chips.length > 0 && (
        <div className="chip-list">
          {chips.map((label) => (
            <span key={label} className="chip" style={{ cursor: 'default' }}>
              {label}
            </span>
          ))}
        </div>
      )}

      <div>
        <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px' }}>🎯 나에게 맞춘 트렌드</p>
        <NewsCardList cards={guide.cards} tier={guide.tier} />
      </div>

      <InterestTopicSettings onSaved={refreshInterestCards} />

      {interestCards.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px' }}>📌 관심 토픽 뉴스</p>
          <NewsCardList cards={interestCards} tier="HOUSING" />
        </div>
      )}

      {todayCards.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px' }}>🔥 오늘의 인기 경제 이슈</p>
          <NewsCardList cards={todayCards} tier="TODAY" />
        </div>
      )}
    </section>
  )
}

export default TrendGuide
