import { useEffect, useState } from 'react'
import { getExpenses, getExpenseStats } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

function yearMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function MonthlyReport() {
  const [topCategory, setTopCategory] = useState(null)
  const [thisMonthTotal, setThisMonthTotal] = useState(0)
  const [lastMonthTotal, setLastMonthTotal] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const now = new Date()
  const thisYm = yearMonthKey(now)
  const lastYm = yearMonthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))

  useEffect(() => {
    Promise.all([
      getExpenseStats({ startYearMonth: thisYm, endYearMonth: thisYm, categories: [] }).catch(() => ({ categorySummaries: [] })),
      getExpenses().catch(() => []),
    ]).then(([stats, expenses]) => {
      const top = stats.categorySummaries.find((s) => s.category)
      setTopCategory(top ?? null)

      let thisTotal = 0
      let lastTotal = 0
      expenses
        .filter((e) => e.transactionType !== 'INCOME' && !e.isSettlement)
        .forEach((e) => {
          const ym = e.expenseDate.slice(0, 7)
          if (ym === thisYm) thisTotal += Number(e.amount)
          else if (ym === lastYm) lastTotal += Number(e.amount)
        })
      setThisMonthTotal(thisTotal)
      setLastMonthTotal(lastTotal)
      setLoaded(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loaded) {
    return null
  }

  const saved = lastMonthTotal - thisMonthTotal
  const achieved = saved >= 0

  return (
    <div
      className="card"
      style={{
        background: 'var(--accent-strong)',
        border: 'none',
      }}
    >
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', opacity: 0.8, margin: '0 0 6px' }}>
        {now.getMonth() + 1}월 요약 리포트
      </p>
      <h2 style={{ margin: '0 0 4px', fontSize: '22px', color: '#FFFFFF' }}>
        {achieved ? `지난달보다 ${formatWon(Math.abs(saved))} 절약했어요` : `지난달보다 ${formatWon(Math.abs(saved))} 더 썼어요`}
      </h2>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#FFFFFF', opacity: 0.85 }}>
        이번 달 지출 {formatWon(thisMonthTotal)}
      </p>
      {topCategory && (
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
          가장 많이 쓴 카테고리: {topCategory.category} ({formatWon(topCategory.totalAmount)})
        </p>
      )}
    </div>
  )
}

export default MonthlyReport
