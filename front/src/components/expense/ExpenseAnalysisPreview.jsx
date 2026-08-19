import { useState } from 'react'
import { saveExpense } from '../../api/expenseApi'

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
      })
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h3>분석 결과 확인</h3>
      <p>지출내역: {analysis.expenseDesc}</p>
      <p>지출금액: {analysis.amount}</p>
      <div>
        <label>
          카테고리
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          트렌드 관련 여부
          <input
            type="checkbox"
            checked={isTrendRelated}
            onChange={(e) => setIsTrendRelated(e.target.checked)}
          />
        </label>
      </div>
      <button type="button" onClick={handleSave} disabled={saving}>
        {saving ? '등록 중...' : '등록'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default ExpenseAnalysisPreview
