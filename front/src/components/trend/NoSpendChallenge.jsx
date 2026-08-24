import { useEffect, useState } from 'react'
import { getExpenses } from '../../api/expenseApi'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const TARGET_KEY = 'trendledger_no_spend_weekly_target'

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function NoSpendChallenge() {
  const [spentDays, setSpentDays] = useState(null)
  const [weeklyTarget, setWeeklyTarget] = useState(Number(localStorage.getItem(TARGET_KEY)) || 3)

  useEffect(() => {
    getExpenses()
      .then((expenses) => {
        const days = new Set()
        expenses
          .filter((e) => e.transactionType !== 'INCOME' && !e.isSettlement)
          .forEach((e) => days.add(e.expenseDate))
        setSpentDays(days)
      })
      .catch(() => setSpentDays(new Set()))
  }, [])

  function changeTarget(delta) {
    setWeeklyTarget((prev) => {
      const next = Math.min(7, Math.max(1, prev + delta))
      localStorage.setItem(TARGET_KEY, String(next))
      return next
    })
  }

  if (!spentDays) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 이번 주(일~토) 날짜 목록
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  // 이번 달 1일부터 오늘까지 무지출 일수
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  let noSpendCount = 0
  for (let d = new Date(monthStart); d <= today; d.setDate(d.getDate() + 1)) {
    if (!spentDays.has(dateKey(d))) noSpendCount++
  }

  const weekNoSpendCount = weekDates.filter((d) => d <= today && !spentDays.has(dateKey(d))).length
  const challengeAchieved = weekNoSpendCount >= weeklyTarget

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>🔥 무지출 챌린지</h3>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-strong)' }}>
          이번 달 {noSpendCount}일 성공
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          이번 주 목표: 무지출 {weeklyTarget}일
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button type="button" onClick={() => changeTarget(-1)} style={{ border: 'none', background: 'var(--accent-soft)', borderRadius: '6px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>-</button>
          <button type="button" onClick={() => changeTarget(1)} style={{ border: 'none', background: 'var(--accent-soft)', borderRadius: '6px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>+</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '10px' }}>
        {weekDates.map((d, i) => {
          const isFuture = d > today
          const noSpend = !isFuture && !spentDays.has(dateKey(d))
          const isToday = dateKey(d) === dateKey(today)
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: isFuture ? 'transparent' : noSpend ? 'var(--accent-fill)' : 'var(--accent-soft)',
                border: isToday ? '1.5px solid var(--accent-strong)' : '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: 700, color: isFuture ? 'var(--color-text-muted)' : noSpend ? 'var(--accent-strong)' : 'var(--color-text-muted)' }}>
                {WEEKDAY_LABELS[i]}
              </span>
              <span style={{ fontSize: '11px' }}>{isFuture ? '' : noSpend ? '✅' : '·'}</span>
            </div>
          )
        })}
      </div>

      <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: challengeAchieved ? 'var(--accent-strong)' : 'var(--color-text-muted)' }}>
        {challengeAchieved ? '🎉 이번 주 목표 달성했어요!' : `이번 주 ${weekNoSpendCount}/${weeklyTarget}일 · 조금만 더!`}
      </p>
    </div>
  )
}

export default NoSpendChallenge
