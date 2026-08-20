import { useEffect, useState } from 'react'
import { getExpenses } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function yearMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function buildCalendarCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(firstWeekday).fill(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day)
  }
  return cells
}

function signedAmount(value) {
  const rounded = Math.round(Number(value))
  return rounded >= 0 ? `+${formatWon(rounded)}` : `-${formatWon(Math.abs(rounded))}`
}

function MonthlyCalendar() {
  const [expenses, setExpenses] = useState([])
  const [dailyNet, setDailyNet] = useState({})
  const [thisMonthTotal, setThisMonthTotal] = useState(0)
  const [lastMonthTotal, setLastMonthTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const thisYm = yearMonthKey(now)
  const lastYm = yearMonthKey(new Date(year, month - 1, 1))

  useEffect(() => {
    getExpenses()
      .then((data) => {
        setExpenses(data)

        const net = {}
        let thisTotal = 0
        let lastTotal = 0

        // 정산(더치페이) 목적 거래는 내 순수 소비가 아니므로 캘린더/비교에서 제외한다.
        data
          .filter((e) => !e.isSettlement)
          .forEach((e) => {
            const ym = e.expenseDate.slice(0, 7)
            const signed = e.transactionType === 'INCOME' ? Number(e.amount) : -Number(e.amount)
            if (ym === thisYm) {
              const day = Number(e.expenseDate.slice(8, 10))
              net[day] = (net[day] ?? 0) + signed
              if (e.transactionType !== 'INCOME') thisTotal += Number(e.amount)
            } else if (ym === lastYm && e.transactionType !== 'INCOME') {
              lastTotal += Number(e.amount)
            }
          })

        setDailyNet(net)
        setThisMonthTotal(thisTotal)
        setLastMonthTotal(lastTotal)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <p className="muted">불러오는 중...</p>
  }

  const cells = buildCalendarCells(year, month)
  const today = now.getDate()
  const saved = lastMonthTotal - thisMonthTotal
  const savedPct = lastMonthTotal > 0 ? (Math.abs(saved) / lastMonthTotal) * 100 : null

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null
  const selectedTransactions = selectedDateStr
    ? expenses.filter((e) => e.expenseDate === selectedDateStr)
    : []

  return (
    <div className="card section">
      <h3 style={{ margin: 0 }}>{year}년 {month + 1}월 지출 캘린더</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} style={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            {label}
          </div>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} />
          }
          const net = dailyNet[day]
          const isToday = day === today
          const isSelected = day === selectedDay
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay((prev) => (prev === day ? null : day))}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--accent-fill)' : net ? 'var(--accent-soft)' : 'transparent',
                border: isToday ? '1.5px solid var(--accent-fill)' : '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px',
                padding: '2px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: isToday ? 800 : 600, color: isSelected ? '#FFFFFF' : 'inherit' }}>
                {day}
              </span>
              {net ? (
                <span
                  style={{
                    fontSize: '8px',
                    color: isSelected ? '#FFFFFF' : net > 0 ? 'var(--accent-strong)' : 'var(--color-danger)',
                    fontWeight: 700,
                  }}
                >
                  {signedAmount(net)}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="card" style={{ background: 'var(--accent-soft)', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{selectedDateStr} 내역</span>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              닫기 ✕
            </button>
          </div>
          {selectedTransactions.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>이 날짜에 등록된 거래가 없어요.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {selectedTransactions.map((e) => {
                const isIncome = e.transactionType === 'INCOME'
                return (
                  <div
                    key={e.expenseId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.expenseDesc}
                      </p>
                      <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                        {e.category ?? (isIncome ? '수입' : '기타')}
                        {e.isSettlement ? ' · 정산' : ''}
                      </p>
                    </div>
                    <span style={{ flexShrink: 0, fontSize: '13px', fontWeight: 800, color: isIncome ? 'var(--accent-strong)' : 'var(--color-text)' }}>
                      {isIncome ? '+' : '-'}{formatWon(e.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          background: saved >= 0 ? 'var(--accent-soft)' : 'var(--color-warning-bg)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700 }}>
          지난달 대비 {saved >= 0 ? '절약' : '초과 지출'}
        </span>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: saved >= 0 ? 'var(--accent-strong)' : 'var(--color-danger)',
          }}
        >
          {formatWon(Math.abs(saved))}
          {savedPct !== null && ` (${savedPct.toFixed(0)}%)`}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
        <span>이번 달 지출 {formatWon(thisMonthTotal)}</span>
        <span>지난달 지출 {formatWon(lastMonthTotal)}</span>
      </div>
    </div>
  )
}

export default MonthlyCalendar
