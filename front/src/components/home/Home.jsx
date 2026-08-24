import { useEffect, useState } from 'react'
import { getProfile } from '../../api/profileApi'
import { getTrendGuide, getTodayIssues, getInterestIssues } from '../../api/trendGuideApi'
import { getExpenseSummary } from '../../api/expenseApi'
import NewsCardList from '../trend/NewsCardList'
import QuickExpenseInput from './QuickExpenseInput'
import BudgetProgressBar from './BudgetProgressBar'
import { formatWon } from '../../utils/format'

const TIER_LABELS = {
  NONE: '절약 없음',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
}

function Home({ onNavigate }) {
  const [profileRegistered, setProfileRegistered] = useState(null)
  const [tier, setTier] = useState(null)
  const [savingsRate, setSavingsRate] = useState(null)
  const [summary, setSummary] = useState(null)
  const [todayCards, setTodayCards] = useState([])
  const [interestCards, setInterestCards] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [todayLoading, setTodayLoading] = useState(false)
  const [interestLoading, setInterestLoading] = useState(false)

  function refreshTodayIssues() {
    setTodayLoading(true)
    getTodayIssues(true)
      .then(setTodayCards)
      .catch(() => {})
      .finally(() => setTodayLoading(false))
  }

  function refreshInterestIssues() {
    setInterestLoading(true)
    getInterestIssues(true)
      .then(setInterestCards)
      .catch(() => {})
      .finally(() => setInterestLoading(false))
  }

  function refreshSummary() {
    getExpenseSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    getProfile()
      .then((res) => setProfileRegistered(res.registered))
      .catch(() => setProfileRegistered(false))
    getTrendGuide()
      .then((guide) => {
        setTier(guide.tier)
        setSavingsRate(guide.savingsRate)
      })
      .catch(() => setTier(null))
    refreshSummary()
    getTodayIssues()
      .then(setTodayCards)
      .catch(() => setTodayCards([]))
    getInterestIssues()
      .then(setInterestCards)
      .catch(() => setInterestCards([]))
  }, [])

  return (
    <div className="section">
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--accent-fill), var(--accent-soft))',
          border: 'none',
          color: 'var(--accent-strong)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.75, margin: '0 0 4px' }}>
              내 잔액
            </p>
            <h2 style={{ margin: '0 0 12px', fontSize: '28px' }}>
              {summary ? formatWon(summary.balance) : '- 원'}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 9px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.55)',
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              {tier ? TIER_LABELS[tier] ?? tier : '-'}
            </span>
            {savingsRate !== null && (
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, opacity: 0.85 }}>
                이번 달 절약률 {(Number(savingsRate) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', margin: '0 0 2px', opacity: 0.75 }}>순수입 (정산 제외)</p>
            <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
              {summary ? formatWon(summary.netPersonalIncome) : '-'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', margin: '0 0 2px', opacity: 0.75 }}>순지출 (정산 제외)</p>
            <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
              {summary ? formatWon(summary.netPersonalExpense) : '-'}
            </p>
          </div>
        </div>
      </div>

      <QuickExpenseInput onSaved={refreshSummary} />
      <BudgetProgressBar onNavigate={onNavigate} refreshKey={refreshKey} />

      {todayCards.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              오늘의 트렌드 이슈
            </p>
            <button
              type="button"
              onClick={refreshTodayIssues}
              disabled={todayLoading}
              aria-label="새로고침"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '15px', opacity: 0.45, lineHeight: 1 }}
            >
              {todayLoading ? '⏳' : '🔄'}
            </button>
          </div>
          <NewsCardList cards={todayCards} tier="TODAY" />
        </div>
      )}

      {interestCards.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              📌 관심 토픽 뉴스
            </p>
            <button
              type="button"
              onClick={refreshInterestIssues}
              disabled={interestLoading}
              aria-label="새로고침"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '15px', opacity: 0.45, lineHeight: 1 }}
            >
              {interestLoading ? '⏳' : '🔄'}
            </button>
          </div>
          <NewsCardList cards={interestCards} tier="HOUSING" />
        </div>
      )}

      {profileRegistered === false && (
        <div className="banner-warning">
          <p>아직 프로필이 없어요. 먼저 등록하면 더 정확한 가이드를 받을 수 있어요.</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('profile')}>
            프로필 등록하러 가기
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
