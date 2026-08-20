import { useState } from 'react'
import { updateExpense, deleteExpense } from '../../api/expenseApi'
import { formatWon, toDigits, formatAmountInput } from '../../utils/format'
import { CATEGORY_OPTIONS } from '../dashboard/StatFilterForm'

function ExpenseEditRow({ expense, onDone, onCancel }) {
  const [expenseDesc, setExpenseDesc] = useState(expense.expenseDesc)
  const [amount, setAmount] = useState(String(Math.round(Number(expense.amount))))
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate)
  const [category, setCategory] = useState(expense.category ?? CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1])
  const [transactionType, setTransactionType] = useState(expense.transactionType)
  const [isSettlement, setIsSettlement] = useState(expense.isSettlement)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isIncome = transactionType === 'INCOME'

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await updateExpense(expense.expenseId, {
        expenseDesc,
        amount: Number(amount),
        expenseDate,
        category: isIncome ? null : category,
        isTrendRelated: expense.isTrendRelated,
        transactionType,
        isSettlement,
      })
      onDone()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input
          type="text"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
          style={{ flex: 1.4, minWidth: 0, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
        <input
          type="text"
          inputMode="numeric"
          value={amount ? formatAmountInput(amount) : ''}
          onChange={(e) => setAmount(toDigits(e.target.value))}
          style={{ flex: 1, minWidth: 0, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          style={{ flex: 1, minWidth: '120px', padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <option value="EXPENSE">지출</option>
          <option value="INCOME">수입</option>
        </select>
        {!isIncome && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '8px' }}>
        <input type="checkbox" checked={isSettlement} onChange={(e) => setIsSettlement(e.target.checked)} />
        정산(더치페이)
      </label>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '6px 14px', fontSize: '12px' }}>
          {saving ? '저장 중...' : '저장'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ padding: '6px 14px', fontSize: '12px' }}>
          취소
        </button>
      </div>
      {error && <p className="error-text" style={{ margin: '6px 0 0' }}>{error}</p>}
    </div>
  )
}

function ExpenseList({ expenses, onChanged }) {
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(expenseId) {
    if (!window.confirm('이 거래를 삭제할까요?')) return
    setDeletingId(expenseId)
    try {
      await deleteExpense(expenseId)
      onChanged && onChanged()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card section">
      <h2>지출 기록 목록</h2>
      {expenses.length === 0 ? (
        <p className="muted">등록된 지출 기록이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {expenses.map((expense) => {
            if (editingId === expense.expenseId) {
              return (
                <ExpenseEditRow
                  key={expense.expenseId}
                  expense={expense}
                  onDone={() => {
                    setEditingId(null)
                    onChanged && onChanged()
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )
            }

            const isIncome = expense.transactionType === 'INCOME'
            return (
              <div
                key={expense.expenseId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {expense.expenseDesc}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {expense.expenseDate} · {expense.category ?? (isIncome ? '수입' : '기타')}
                    {expense.isSettlement ? ' · 정산' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: isIncome ? 'var(--accent-strong)' : 'var(--color-text)',
                    }}
                  >
                    {isIncome ? '+' : '-'}{formatWon(expense.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingId(expense.expenseId)}
                    aria-label="수정"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', padding: '4px' }}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(expense.expenseId)}
                    disabled={deletingId === expense.expenseId}
                    aria-label="삭제"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', padding: '4px' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExpenseList
