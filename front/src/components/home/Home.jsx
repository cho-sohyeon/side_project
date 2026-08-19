import { useEffect, useState } from 'react'
import { getProfile } from '../../api/profileApi'
import { getTrendGuide } from '../../api/trendGuideApi'

const TIER_LABELS = {
  NONE: '절약 없음',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
}

const QUICK_LINKS = [
  { key: 'profile', icon: '👤', label: '프로필' },
  { key: 'goal', icon: '🎯', label: '목표' },
  { key: 'expense', icon: '✏️', label: '지출입력' },
  { key: 'savings', icon: '💰', label: '절약확인' },
  { key: 'trend', icon: '📈', label: '투자트렌드' },
]

function Home({ onNavigate }) {
  const [profileRegistered, setProfileRegistered] = useState(null)
  const [tier, setTier] = useState(null)
  const [savingsRate, setSavingsRate] = useState(null)

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
        <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.75, margin: '0 0 4px' }}>
          오늘도 화이팅!
        </p>
        <h2 style={{ margin: '0 0 4px' }}>
          {tier ? `${TIER_LABELS[tier] ?? tier} 등급이에요` : '나만의 절약 리포트'}
        </h2>
        {savingsRate !== null && (
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.85 }}>
            이번 달 절약률 {(Number(savingsRate) * 100).toFixed(1)}%
          </p>
        )}
      </div>

      {profileRegistered === false && (
        <div className="banner-warning">
          <p>아직 프로필이 없어요. 먼저 등록하면 더 정확한 가이드를 받을 수 있어요.</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('profile')}>
            프로필 등록하러 가기
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {QUICK_LINKS.map((link) => (
          <button
            key={link.key}
            type="button"
            className="card"
            onClick={() => onNavigate(link.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '18px 8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '26px' }}>{link.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
