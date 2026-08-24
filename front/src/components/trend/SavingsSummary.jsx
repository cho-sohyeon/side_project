import { useEffect, useState } from 'react'
import TierBadge from './TierBadge'
import MonthlyCalendar from './MonthlyCalendar'
import CategoryQuickSummary from './CategoryQuickSummary'
import MonthlyReport from './MonthlyReport'
import SpendingTrendChart from './SpendingTrendChart'
import NoSpendChallenge from './NoSpendChallenge'
import { getTrendGuide } from '../../api/trendGuideApi'

function SavingsSummary() {
  const [guide, setGuide] = useState(null)
  const [error, setError] = useState(null)
  const [showTrend, setShowTrend] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    getTrendGuide()
      .then(setGuide)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!guide) {
    return <p className="muted">불러오는 중...</p>
  }

  return (
    <section className="section">
      <h2>오늘의 절약 확인</h2>
      <MonthlyReport />
      <NoSpendChallenge />
      <TierBadge tier={guide.tier} savingsRate={guide.savingsRate} />
      <CategoryQuickSummary />

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          className="btn"
          onClick={() => setShowTrend((v) => !v)}
          style={{ flex: 1, fontSize: '12px' }}
        >
          📈 지출 추이 {showTrend ? '접기' : '보기'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setShowCalendar((v) => !v)}
          style={{ flex: 1, fontSize: '12px' }}
        >
          📅 캘린더 {showCalendar ? '접기' : '보기'}
        </button>
      </div>

      {showTrend && <SpendingTrendChart />}
      {showCalendar && <MonthlyCalendar />}
    </section>
  )
}

export default SavingsSummary
