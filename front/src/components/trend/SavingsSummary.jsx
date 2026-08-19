import { useEffect, useState } from 'react'
import TierBadge from './TierBadge'
import { getTrendGuide } from '../../api/trendGuideApi'

function SavingsSummary() {
  const [guide, setGuide] = useState(null)
  const [error, setError] = useState(null)

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
      <TierBadge tier={guide.tier} savingsRate={guide.savingsRate} />
    </section>
  )
}

export default SavingsSummary
