import { useEffect, useState } from 'react'
import { getRecurringExpenses, saveRecurringExpense, deleteRecurringExpense } from '../../api/recurringExpenseApi'
import { CATEGORY_OPTIONS } from '../dashboard/StatFilterForm'
import { toDigits, formatAmountInput, formatWon } from '../../utils/format'

function RecurringExpenseManager() {
  const [items, setItems] = useState([])
  const [expenseDesc, setExpenseDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0])
  const [transactionType, setTransactionType] = useState('EXPENSE')
  const [dayOfMonth, setDayOfMonth] = useState('1')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function refresh() {
    getRecurringExpenses()
      .then(setItems)
      .catch(() => setItems([]))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd() {
    setError(null)
    setSaving(true)
    try {
      await saveRecurringExpense({
        expenseDesc,
        amount: Number(amount),
        category: transactionType === 'EXPENSE' ? category : null,
        transactionType,
        dayOfMonth: Number(dayOfMonth),
      })
      setExpenseDesc('')
      setAmount('')
      refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(recurringId) {
    await deleteRecurringExpense(recurringId)
    refresh()
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 4px' }}>정기결제/반복 지출</h3>
      <p className="muted" style={{ margin: '0 0 12px', fontSize: '12px' }}>
        매달 같은 날짜에 나가는 구독료 등을 등록해두면 자동으로 등록돼요.
      </p>

      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
          {items.map((item) => (
            <div
              key={item.recurringId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{item.expenseDesc}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  매달 {item.dayOfMonth}일 · {item.transactionType === 'INCOME' ? '수입' : item.category ?? '기타'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800 }}>
                  {item.transactionType === 'INCOME' ? '+' : '-'}{formatWon(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.recurringId)}
                  aria-label="삭제"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', opacity: 0.5 }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input
          type="text"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
          placeholder="예: 넷플릭스 구독료"
          style={{ flex: 1.4, minWidth: 0, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
        <input
          type="text"
          inputMode="numeric"
          value={amount ? formatAmountInput(amount) : ''}
          onChange={(e) => setAmount(toDigits(e.target.value))}
          placeholder="금액"
          style={{ flex: 1, minWidth: 0, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <option value="EXPENSE">지출</option>
          <option value="INCOME">수입</option>
        </select>
        {transactionType === 'EXPENSE' && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        <select
          value={dayOfMonth}
          onChange={(e) => setDayOfMonth(e.target.value)}
          style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>매달 {day}일</option>
          ))}
        </select>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleAdd} disabled={saving || !expenseDesc || !amount}>
        {saving ? '등록 중...' : '반복 항목 추가'}
      </button>
      {error && <p className="error-text" style={{ margin: '8px 0 0' }}>{error}</p>}
    </div>
  )
}

export default RecurringExpenseManager
