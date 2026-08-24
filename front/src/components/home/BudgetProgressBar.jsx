import { useEffect, useState } from 'react'
import { getBudgetGoal } from '../../api/budgetGoalApi'
import { getExpenses } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function notifyBudgetWarning(yearMonth, rawRatio) {
  if (typeof Notification === 'undefined') return

  const level = rawRatio >= 1 ? 'over' : rawRatio >= 0.9 ? 'warn' : null
  if (!level) return

  const flagKey = `trendledger_budget_notified_${yearMonth}_${level}`
  if (localStorage.getItem(flagKey)) return

  function fire() {
    localStorage.setItem(flagKey, 'true')
    new Notification(
      level === 'over' ? '이번 달 예산을 초과했어요' : '이번 달 예산의 90%를 썼어요',
      { body: 'TrendLedger에서 지출 현황을 확인해보세요.' }
    )
  }

  if (Notification.permission === 'granted') {
    fire()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') fire()
    })
  }
}

function BudgetProgressBar({ onNavigate, refreshKey }) {
  const [goal, setGoal] = useState(null)
  const [spent, setSpent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const yearMonth = currentYearMonth()
    Promise.all([
      getBudgetGoal(yearMonth).catch(() => null),
      getExpenses().catch(() => []),
    ]).then(([goalResult, expenses]) => {
      setGoal(goalResult)
      const thisMonthSpend = expenses
        .filter((e) => e.transactionType !== 'INCOME' && !e.isSettlement && e.expenseDate.slice(0, 7) === yearMonth)
        .reduce((sum, e) => sum + Number(e.amount), 0)
      setSpent(thisMonthSpend)
      setLoaded(true)

      if (goalResult && Number(goalResult.targetAmount) > 0) {
        notifyBudgetWarning(yearMonth, thisMonthSpend / Number(goalResult.targetAmount))
      }
    })
  }, [refreshKey])

  if (!loaded) {
    return null
  }

  if (!goal) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>이번 달 예산 목표가 없어요</span>
        <button type="button" className="btn" onClick={() => onNavigate('goal')} style={{ padding: '6px 12px', fontSize: '12px' }}>
          목표 설정
        </button>
      </div>
    )
  }

  const target = Number(goal.targetAmount)
  const ratio = target > 0 ? Math.min((spent / target) * 100, 100) : 0
  const over = spent > target

  return (
    <>
      {over && (
        <div className="banner-warning" style={{ background: 'var(--color-danger)', color: '#FFFFFF' }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            🚨 이번 달 예산을 {formatWon(spent - target)} 초과했어요
          </p>
        </div>
      )}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>이번 달 예산 사용</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: over ? 'var(--color-danger)' : 'var(--accent-strong)' }}>
            {formatWon(spent)} / {formatWon(target)}
          </span>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', background: 'var(--accent-soft)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${ratio}%`,
              height: '100%',
              background: over ? 'var(--color-danger)' : 'var(--accent-fill)',
              transition: 'width 0.2s',
            }}
          />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {over ? '목표 금액을 초과했어요' : `${(100 - ratio).toFixed(0)}% 남았어요`}
        </p>
      </div>
    </>
  )
}

export default BudgetProgressBar
