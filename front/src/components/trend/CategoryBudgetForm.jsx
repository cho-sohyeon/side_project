import { useEffect, useState } from 'react'
import { getCategoryBudgetStatus, saveCategoryBudget, deleteCategoryBudget } from '../../api/categoryBudgetApi'
import { CATEGORY_OPTIONS } from '../dashboard/StatFilterForm'
import { toDigits, formatAmountInput, formatWon } from '../../utils/format'

function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function CategoryBudgetForm() {
  const yearMonth = currentYearMonth()
  const [statuses, setStatuses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0])
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function refresh() {
    getCategoryBudgetStatus(yearMonth)
      .then(setStatuses)
      .catch(() => setStatuses([]))
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd() {
    setError(null)
    setSaving(true)
    try {
      await saveCategoryBudget({ yearMonth, category: selectedCategory, targetAmount: Number(amount) })
      setAmount('')
      refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category) {
    await deleteCategoryBudget(yearMonth, category)
    refresh()
  }

  const availableCategories = CATEGORY_OPTIONS.filter((c) => !statuses.some((s) => s.category === c))

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 4px' }}>카테고리별 예산</h3>
      <p className="muted" style={{ margin: '0 0 12px', fontSize: '12px' }}>
        카테고리마다 이번 달 예산을 따로 정해두면 어디서 초과했는지 바로 보여요.
      </p>

      {statuses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          {statuses.map((s) => {
            const ratio = s.targetAmount > 0 ? Math.min((s.spentAmount / s.targetAmount) * 100, 100) : 0
            const over = s.spentAmount > s.targetAmount
            return (
              <div key={s.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{s.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: over ? 'var(--color-danger)' : 'var(--accent-strong)' }}>
                      {formatWon(s.spentAmount)} / {formatWon(s.targetAmount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.category)}
                      aria-label="삭제"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', opacity: 0.5 }}
                    >
                      ✕
                    </button>
                  </span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'var(--accent-soft)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${ratio}%`,
                      height: '100%',
                      background: over ? 'var(--color-danger)' : 'var(--accent-fill)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {availableCategories.length > 0 && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            inputMode="numeric"
            value={amount ? formatAmountInput(amount) : ''}
            onChange={(e) => setAmount(toDigits(e.target.value))}
            placeholder="예산 금액"
            style={{ flex: 1, minWidth: 0, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
          <button type="button" className="btn btn-primary" onClick={handleAdd} disabled={saving || !amount} style={{ padding: '8px 14px', fontSize: '12px' }}>
            추가
          </button>
        </div>
      )}
      {error && <p className="error-text" style={{ margin: '8px 0 0' }}>{error}</p>}
    </div>
  )
}

export default CategoryBudgetForm
