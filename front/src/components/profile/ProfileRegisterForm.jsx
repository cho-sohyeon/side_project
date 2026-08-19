import { useState } from 'react'
import BasicInfoForm from './BasicInfoForm'
import SpendingHabitSurvey from './SpendingHabitSurvey'
import InvestmentSurvey from './InvestmentSurvey'
import { registerProfile, updateProfile } from '../../api/profileApi'

function ProfileRegisterForm({ mode, initialProfile, onSaved }) {
  const [basicInfo, setBasicInfo] = useState({
    ageHouseholdType: initialProfile?.ageHouseholdType ?? 'YOUTH',
    hasSubscriptionAccount: initialProfile?.hasSubscriptionAccount ?? true,
    livingType: initialProfile?.livingType ?? 'INDEPENDENT',
  })
  const [spendingAnswers, setSpendingAnswers] = useState(Array(5).fill(null))
  const [investmentAnswers, setInvestmentAnswers] = useState(Array(3).fill(null))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isComplete =
    spendingAnswers.every((a) => a !== null) && investmentAnswers.every((a) => a !== null)

  async function handleSubmit() {
    if (!isComplete) {
      setError('모든 설문 문항에 응답해주세요.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      const payload = {
        ...basicInfo,
        spendingHabitAnswers: spendingAnswers,
        investmentAnswers: investmentAnswers,
      }
      if (mode === 'update') {
        await updateProfile(payload)
      } else {
        await registerProfile(payload)
      }
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2>{mode === 'update' ? '프로필 수정' : '프로필 등록'}</h2>
      <BasicInfoForm value={basicInfo} onChange={setBasicInfo} />
      <SpendingHabitSurvey answers={spendingAnswers} onChange={setSpendingAnswers} />
      <InvestmentSurvey answers={investmentAnswers} onChange={setInvestmentAnswers} />
      <button type="button" onClick={handleSubmit} disabled={saving}>
        {saving ? '저장 중...' : mode === 'update' ? '수정 완료' : '등록'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default ProfileRegisterForm
