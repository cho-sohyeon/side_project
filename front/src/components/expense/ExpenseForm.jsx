import { useState } from 'react'
import { analyzeExpense, saveExpense } from '../../api/expenseApi'
import { toDigits, formatAmountInput } from '../../utils/format'

function ExpenseForm({ onAnalyzed, onSaved }) {
  const [transactionType, setTransactionType] = useState('EXPENSE')
  const [expenseDesc, setExpenseDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [isSettlement, setIsSettlement] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isIncome = transactionType === 'INCOME'

  function selectType(type) {
    setTransactionType(type)
    setIsSettlement(false)
  }

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
        transactionType,
        isSettlement,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveIncome() {
    setError(null)
    setLoading(true)
    try {
      await saveExpense({
        expenseDesc,
        amount: Number(amount),
        expenseDate: expenseDate || null,
        category: null,
        isTrendRelated: false,
        transactionType: 'INCOME',
        isSettlement,
      })
      setExpenseDesc('')
      setAmount('')
      setExpenseDate('')
      setIsSettlement(false)
      onSaved && onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card section">
      <h2 style={{ margin: 0 }}>거래 등록</h2>

      <div
        style={{
          display: 'flex',
          background: 'var(--accent-soft)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          gap: '4px',
        }}
      >
        {[
          { type: 'EXPENSE', label: '지출' },
          { type: 'INCOME', label: '수입' },
        ].map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => selectType(tab.type)}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              background: transactionType === tab.type ? 'var(--color-surface)' : 'transparent',
              color: transactionType === tab.type ? 'var(--accent-strong)' : 'var(--color-text-muted)',
              boxShadow: transactionType === tab.type ? 'var(--shadow-sm)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="field">
        <input
          type="text"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
          placeholder={isIncome ? '어떤 수입인가요? 예: 용돈' : '어디에 썼나요? 예: 스타벅스'}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <input
            type="text"
            inputMode="numeric"
            value={amount ? `${formatAmountInput(amount)}원` : ''}
            onChange={(e) => setAmount(toDigits(e.target.value))}
            placeholder="금액"
          />
        </div>
        <div className="field">
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>
      </div>

      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '999px',
          border: '1.5px solid var(--color-border)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          width: 'fit-content',
          background: isSettlement ? 'var(--accent-soft)' : 'transparent',
          borderColor: isSettlement ? 'var(--accent-fill)' : 'var(--color-border)',
        }}
      >
        <input
          type="checkbox"
          checked={isSettlement}
          onChange={(e) => setIsSettlement(e.target.checked)}
        />
        🧾 더치페이/정산
      </label>

      {isIncome ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveIncome}
          disabled={loading || !expenseDesc || !amount}
        >
          {loading ? '등록 중...' : '등록'}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !expenseDesc || !amount}
        >
          {loading ? '분석 중...' : '등록'}
        </button>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default ExpenseForm
