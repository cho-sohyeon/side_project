import { useEffect, useState } from 'react'
import ProfileRegisterForm from './ProfileRegisterForm'
import { getProfile } from '../../api/profileApi'
import { getNickname } from '../../api/httpClient'
import { updateNickname } from '../../api/accountApi'
import AccountSettings from './AccountSettings'
import { AGE_HOUSEHOLD_OPTIONS, LIVING_TYPE_OPTIONS } from './BasicInfoForm'

const SPENDING_HABIT_INFO = {
  PLANNED: { label: '계획소비형', icon: '📋', desc: '예산을 세우고 그 안에서 지출해요' },
  IMPULSIVE: { label: '충동소비형', icon: '⚡', desc: '필요하다 느끼면 바로 구매하는 편이에요' },
  FRUGAL: { label: '절약형', icon: '🌱', desc: '꼭 필요한 지출만 최소화해서 써요' },
}

const INVESTMENT_INFO = {
  CONSERVATIVE: { label: '안정형', icon: '🛡️', desc: '원금 손실 없이 안전하게 굴려요' },
  NEUTRAL: { label: '중립형', icon: '⚖️', desc: '안전자산과 투자자산을 균형있게 배분해요' },
  AGGRESSIVE: { label: '공격형', icon: '🚀', desc: '높은 수익을 위해 변동성을 감수해요' },
}

const BASIC_INFO_ICONS = {
  ageHousehold: '👤',
  subscription: '🏦',
  living: '🏠',
}

function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

function ProfileView({ onLogout }) {
  const [response, setResponse] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [savingNickname, setSavingNickname] = useState(false)
  const [nicknameError, setNicknameError] = useState(null)

  async function refresh() {
    setError(null)
    try {
      const data = await getProfile()
      setResponse(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleSaved() {
    setEditing(false)
    refresh()
  }

  function startEditingNickname() {
    setNicknameInput(getNickname() ?? '')
    setNicknameError(null)
    setEditingNickname(true)
  }

  async function handleSaveNickname() {
    setNicknameError(null)
    setSavingNickname(true)
    try {
      await updateNickname(nicknameInput)
      setEditingNickname(false)
    } catch (e) {
      setNicknameError(e.message)
    } finally {
      setSavingNickname(false)
    }
  }

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!response) {
    return <p className="muted">불러오는 중...</p>
  }

  if (!response.registered) {
    return <ProfileRegisterForm mode="register" onSaved={handleSaved} />
  }

  if (editing) {
    return (
      <ProfileRegisterForm
        mode="update"
        initialProfile={response.profile}
        initialSpendingAnswers={response.spendingHabitAnswers}
        initialInvestmentAnswers={response.investmentAnswers}
        onSaved={handleSaved}
      />
    )
  }

  const profile = response.profile
  const spending = SPENDING_HABIT_INFO[profile.spendingHabitType]
  const investment = INVESTMENT_INFO[profile.investmentPropensityType]

  const basicInfoItems = [
    { icon: BASIC_INFO_ICONS.ageHousehold, label: '연령대/가구 유형', value: labelOf(AGE_HOUSEHOLD_OPTIONS, profile.ageHouseholdType) },
    { icon: BASIC_INFO_ICONS.subscription, label: '청약통장', value: profile.hasSubscriptionAccount ? '있음' : '없음' },
    { icon: BASIC_INFO_ICONS.living, label: '독립 여부', value: labelOf(LIVING_TYPE_OPTIONS, profile.livingType) },
  ]

  return (
    <section className="section">
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--accent-fill), var(--accent-soft))',
          border: 'none',
          color: 'var(--accent-strong)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🙂
          </div>
          <div>
            {editingNickname ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  autoFocus
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--accent-strong)',
                    width: '90px',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveNickname}
                  disabled={savingNickname || !nicknameInput}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✅
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNickname(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <p
                onClick={startEditingNickname}
                style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 700, opacity: 0.75, cursor: 'pointer' }}
              >
                {getNickname() ?? '내 프로필'} ✏️
              </p>
            )}
            {nicknameError && (
              <p className="error-text" style={{ margin: '0 0 4px', fontSize: '11px' }}>{nicknameError}</p>
            )}
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
              {labelOf(AGE_HOUSEHOLD_OPTIONS, profile.ageHouseholdType)} · {spending?.label}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            className="btn"
            onClick={() => setEditing(true)}
            style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'transparent' }}
          >
            수정
          </button>
          {onLogout && (
            <button
              type="button"
              className="btn"
              onClick={onLogout}
              style={{ background: 'transparent', borderColor: 'transparent', color: 'var(--accent-strong)', fontSize: '12px' }}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px' }}>기본 정보</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {basicInfoItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-soft)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 0 6px' }}>소비습관</p>
          <p style={{ fontSize: '28px', margin: '0 0 4px' }}>{spending?.icon}</p>
          <p style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px' }}>{spending?.label}</p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, wordBreak: 'keep-all' }}>{spending?.desc}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 0 6px' }}>투자성향</p>
          <p style={{ fontSize: '28px', margin: '0 0 4px' }}>{investment?.icon}</p>
          <p style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px' }}>{investment?.label}</p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, wordBreak: 'keep-all' }}>{investment?.desc}</p>
        </div>
      </div>

      <AccountSettings onAccountDeleted={onLogout} />
    </section>
  )
}

export default ProfileView
