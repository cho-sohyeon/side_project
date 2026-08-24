import { useEffect, useState } from 'react'
import { getBudgetGoal, saveBudgetGoal } from '../../api/budgetGoalApi'
import { formatWon } from '../../utils/format'
import AmountInput from '../common/AmountInput'
import CategoryBudgetForm from './CategoryBudgetForm'
import RecurringExpenseManager from '../expense/RecurringExpenseManager'

function currentYearMonth() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

// back/src/main/resources/application.properties savings.tier.* 와 동일한 값
const TIERS = [
  { key: 'PLATINUM', label: 'Platinum', maxRate: 0.40 },
  { key: 'GOLD', label: 'Gold', maxRate: 0.25 },
  { key: 'SILVER', label: 'Silver', maxRate: 0.10 },
  { key: 'BRONZE', label: 'Bronze', maxRate: 0 },
]

function TierThresholdGuide({ targetAmount }) {
  const amount = Number(targetAmount)
  if (!amount || amount <= 0) {
    return null
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 4px' }}>목표 금액 기준 등급 구간</h3>
      <p className="muted" style={{ margin: '0 0 12px', fontSize: '12px' }}>
        이번 달 지출이 아래 금액 이하이면 해당 등급을 달성해요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {TIERS.map((tier) => {
          const maxSpend = amount * (1 - tier.maxRate)
          return (
            <div
              key={tier.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-soft)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: 'var(--accent-fill)',
                    color: 'var(--accent-strong)',
                    fontSize: 'var(--font-size-caption)',
                    fontWeight: 700,
                  }}
                >
                  {tier.label}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  절약률 {Math.round(tier.maxRate * 100)}% 이상
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{formatWon(maxSpend)} 이하 지출</span>
            </div>
          )
        })}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            목표 금액({formatWon(amount)}) 초과 지출
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>등급 없음</span>
        </div>
      </div>
    </div>
  )
}

function BudgetGoalForm({ onSaved }) {
  const yearMonth = currentYearMonth()
  const [targetAmount, setTargetAmount] = useState('')
  const [existingGoal, setExistingGoal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    try {
      const goal = await getBudgetGoal(yearMonth)
      setExistingGoal(goal)
      if (goal) {
        setTargetAmount(String(Math.round(Number(goal.targetAmount))))
      }
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setError(null)
    setSaving(true)
    try {
      await saveBudgetGoal({ yearMonth, targetAmount: Number(targetAmount) })
      await refresh()
      onSaved?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="section">
      <div className="card">
        <h3>이번 달({yearMonth}) 예산 목표</h3>
        {existingGoal && <p className="muted">현재 설정된 목표: {formatWon(existingGoal.targetAmount)}</p>}
        <div className="field">
          <label>목표 금액</label>
          <AmountInput value={targetAmount} onChange={setTargetAmount} placeholder="예: 500,000" />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || !targetAmount}>
          {saving ? '저장 중...' : existingGoal ? '목표 수정' : '목표 등록'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>

      <TierThresholdGuide targetAmount={targetAmount} />
      <CategoryBudgetForm />
      <RecurringExpenseManager />
    </div>
  )
}

export default BudgetGoalForm
