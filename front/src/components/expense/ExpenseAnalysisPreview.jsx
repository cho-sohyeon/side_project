import { useState } from 'react'
import { saveExpense } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

const CATEGORY_OPTIONS = ['식비', '교통', '쇼핑', '주거', '여가', '금융/투자', '기타']

function ExpenseAnalysisPreview({ analysis, onSaved }) {
  const [category, setCategory] = useState(analysis.category)
  const [isTrendRelated, setIsTrendRelated] = useState(analysis.isTrendRelated)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    setError(null)
    setSaving(true)
    try {
      await saveExpense({
        expenseDesc: analysis.expenseDesc,
        amount: analysis.amount,
        expenseDate: analysis.expenseDate || null,
        category,
        isTrendRelated,
        transactionType: analysis.transactionType || 'EXPENSE',
        isSettlement: Boolean(analysis.isSettlement),
      })
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card section">
      <h3>분석 결과 확인</h3>
      <p>지출내역: {analysis.expenseDesc}</p>
      <p>지출금액: {formatWon(analysis.amount)}</p>
      <div className="field">
        <label>카테고리</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={isTrendRelated}
            onChange={(e) => setIsTrendRelated(e.target.checked)}
          />
          {' '}트렌드 관련 여부
        </label>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? '등록 중...' : '등록'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default ExpenseAnalysisPreview
