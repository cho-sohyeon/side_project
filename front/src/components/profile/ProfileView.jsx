import { useEffect, useState } from 'react'
import ProfileRegisterForm from './ProfileRegisterForm'
import { getProfile } from '../../api/profileApi'
import { AGE_HOUSEHOLD_OPTIONS, LIVING_TYPE_OPTIONS } from './BasicInfoForm'

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

function ProfileView() {
  const [response, setResponse] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)

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
  return (
    <section className="card section">
      <h2>내 프로필</h2>
      <p>연령대/가구 유형: {labelOf(AGE_HOUSEHOLD_OPTIONS, profile.ageHouseholdType)}</p>
      <p>청약통장 보유: {profile.hasSubscriptionAccount ? '있음' : '없음'}</p>
      <p>독립 여부: {labelOf(LIVING_TYPE_OPTIONS, profile.livingType)}</p>
      <p>소비습관 유형: {SPENDING_HABIT_LABELS[profile.spendingHabitType]}</p>
      <p>투자 성향: {INVESTMENT_LABELS[profile.investmentPropensityType]}</p>
      <button type="button" className="btn" onClick={() => setEditing(true)}>
        수정
      </button>
    </section>
  )
}

export default ProfileView
