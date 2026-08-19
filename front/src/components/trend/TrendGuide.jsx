import { useEffect, useState } from 'react'
import TierBadge from './TierBadge'
import NewsCardList from './NewsCardList'
import BudgetGoalForm from './BudgetGoalForm'
import { getTrendGuide } from '../../api/trendGuideApi'

function TrendGuide() {
  const [guide, setGuide] = useState(null)
  const [error, setError] = useState(null)

  function refresh() {
    getTrendGuide()
      .then(setGuide)
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    refresh()
  }, [])

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <section>
      <h2>절약 티어별 트렌드 투자 가이드</h2>
      <BudgetGoalForm onSaved={refresh} />
      {!guide && <p>불러오는 중...</p>}
      {guide && (
        <>
          {!guide.profileRegistered && (
            <div style={{ background: '#fff3cd', padding: '8px', marginBottom: '8px' }}>
              <p>{guide.profileGuideMessage}</p>
              <a href="#profile-section">프로필 등록하러 가기</a>
            </div>
          )}
          <TierBadge tier={guide.tier} savingsRate={guide.savingsRate} />
          <NewsCardList cards={guide.cards} />
        </>
      )}
    </section>
  )
}

export default TrendGuide
