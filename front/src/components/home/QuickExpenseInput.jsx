import { useState } from 'react'
import { analyzeExpense, saveExpense } from '../../api/expenseApi'
import { toDigits, formatAmountInput, formatWon } from '../../utils/format'

function QuickExpenseInput({ onSaved }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function handleSubmit() {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const numericAmount = Number(amount)
      const analyzed = await analyzeExpense({ expenseDesc: desc, amount: numericAmount, expenseDate: null })
      await saveExpense({
        expenseDesc: desc,
        amount: numericAmount,
        expenseDate: null,
        category: analyzed.category,
        isTrendRelated: analyzed.isTrendRelated,
        transactionType: 'EXPENSE',
        isSettlement: false,
      })
      setResult({ desc, amount: numericAmount, category: analyzed.category })
      setDesc('')
      setAmount('')
      onSaved && onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
        ⚡ 빠른 지출 등록
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="예: 스타벅스"
          style={{
            flex: 1.4,
            minWidth: 0,
            padding: '10px 12px',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
          }}
        />
        <input
          type="text"
          inputMode="numeric"
          value={amount ? formatAmountInput(amount) : ''}
          onChange={(e) => setAmount(toDigits(e.target.value))}
          placeholder="금액"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
          }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !desc || !amount}
          style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : '등록'}
        </button>
      </div>
      {result && (
        <p style={{ fontSize: '12px', color: 'var(--accent-strong)', fontWeight: 600, margin: '8px 0 0' }}>
          ✅ {result.desc} {formatWon(result.amount)} · {result.category} 로 분류됐어요
        </p>
      )}
      {error && (
        <p className="error-text" style={{ margin: '8px 0 0' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default QuickExpenseInput
