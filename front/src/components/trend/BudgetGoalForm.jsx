import { useEffect, useState } from 'react'
import { getBudgetGoal, saveBudgetGoal } from '../../api/budgetGoalApi'

function currentYearMonth() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
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
        setTargetAmount(String(goal.targetAmount))
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
    <div>
      <h3>이번 달({yearMonth}) 예산 목표</h3>
      {existingGoal && <p>현재 설정된 목표: {existingGoal.targetAmount}원</p>}
      <label>
        목표 금액
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="예: 500000"
        />
      </label>
      <button type="button" onClick={handleSave} disabled={saving || !targetAmount}>
        {saving ? '저장 중...' : existingGoal ? '목표 수정' : '목표 등록'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default BudgetGoalForm
