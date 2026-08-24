import { useEffect, useState } from 'react'
import { getExpenses } from '../../api/expenseApi'
import MonthlyTrendChart from '../dashboard/MonthlyTrendChart'

function yearMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function SpendingTrendChart() {
  const [monthlySummaries, setMonthlySummaries] = useState(null)

  useEffect(() => {
    const now = new Date()
    // 최근 6개월(이번 달 포함) 순지출만 집계 — 수입/정산 금액은 제외해 실제 소비 흐름만 보여준다.
    const months = Array.from({ length: 6 }, (_, i) =>
      yearMonthKey(new Date(now.getFullYear(), now.getMonth() - (5 - i), 1))
    )

    getExpenses()
      .then((expenses) => {
        const totals = Object.fromEntries(months.map((m) => [m, 0]))
        expenses
          .filter((e) => e.transactionType !== 'INCOME' && !e.isSettlement)
          .forEach((e) => {
            const ym = e.expenseDate.slice(0, 7)
            if (ym in totals) totals[ym] += Number(e.amount)
          })
        setMonthlySummaries(months.map((m) => ({ yearMonth: m, totalAmount: totals[m] })))
      })
      .catch(() => setMonthlySummaries([]))
  }, [])

  if (!monthlySummaries) {
    return null
  }

  return (
    <div className="card">
      <MonthlyTrendChart monthlySummaries={monthlySummaries} title="최근 6개월 순지출 추이" />
    </div>
  )
}

export default SpendingTrendChart
