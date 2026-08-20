import { useState } from 'react'
import BasicInfoForm from './BasicInfoForm'
import SpendingHabitSurvey from './SpendingHabitSurvey'
import InvestmentSurvey from './InvestmentSurvey'
import { registerProfile, updateProfile } from '../../api/profileApi'

function ProfileRegisterForm({ mode, initialProfile, initialSpendingAnswers, initialInvestmentAnswers, onSaved }) {
  const [basicInfo, setBasicInfo] = useState({
    ageHouseholdType: initialProfile?.ageHouseholdType ?? 'YOUTH',
    hasSubscriptionAccount: initialProfile?.hasSubscriptionAccount ?? true,
    livingType: initialProfile?.livingType ?? 'INDEPENDENT',
  })
  const [spendingAnswers, setSpendingAnswers] = useState(
    initialSpendingAnswers ?? Array(5).fill(null)
  )
  const [investmentAnswers, setInvestmentAnswers] = useState(
    initialInvestmentAnswers ?? Array(3).fill(null)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const totalQuestions = spendingAnswers.length + investmentAnswers.length
  const answeredCount =
    spendingAnswers.filter((a) => a !== null).length + investmentAnswers.filter((a) => a !== null).length
  const isComplete = answeredCount === totalQuestions

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
    <div className="section">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ margin: 0 }}>{mode === 'update' ? '프로필 수정' : '프로필 등록'}</h2>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-strong)' }}>
            {answeredCount}/{totalQuestions} 문항 응답
          </span>
        </div>
        <div style={{ height: '6px', borderRadius: '999px', background: 'var(--accent-soft)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${totalQuestions === 0 ? 0 : (answeredCount / totalQuestions) * 100}%`,
              height: '100%',
              background: 'var(--accent-fill)',
              transition: 'width 0.2s',
            }}
          />
        </div>
      </div>
      <BasicInfoForm value={basicInfo} onChange={setBasicInfo} />
      <SpendingHabitSurvey answers={spendingAnswers} onChange={setSpendingAnswers} />
      <InvestmentSurvey answers={investmentAnswers} onChange={setInvestmentAnswers} />
      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
        {saving ? '저장 중...' : mode === 'update' ? '수정 완료' : '등록'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default ProfileRegisterForm
