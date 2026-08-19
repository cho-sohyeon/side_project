import { useState } from 'react'
import { analyzeExpense } from '../../api/expenseApi'

function ExpenseForm({ onAnalyzed }) {
  const [expenseDesc, setExpenseDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    setError(null)
    setLoading(true)
    try {
      const result = await analyzeExpense({
        expenseDesc,
        amount: Number(amount),
        expenseDate,
      })
      onAnalyzed({
        expenseDesc,
        amount: Number(amount),
        expenseDate,
        category: result.category,
        isTrendRelated: result.isTrendRelated,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card section">
      <h2>지출 기록 등록</h2>
      <div className="field">
        <label>지출내역</label>
        <input
          type="text"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
          placeholder="예: 스타벅스 아메리카노"
        />
      </div>
      <div className="field">
        <label>지출금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="field">
        <label>지출날짜 (미입력 시 오늘 날짜)</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleAnalyze}
        disabled={loading || !expenseDesc || !amount}
      >
        {loading ? '분석 중...' : '분석하기'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default ExpenseForm
