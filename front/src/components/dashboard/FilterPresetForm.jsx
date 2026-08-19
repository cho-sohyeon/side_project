import { useState } from 'react'
import { savePreset } from '../../api/expenseApi'

function FilterPresetForm({ currentFilter, onSaved }) {
  const [presetName, setPresetName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    if (!currentFilter) {
      setError('먼저 조회 조건으로 조회를 실행해주세요.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await savePreset({
        presetName,
        startYearMonth: currentFilter.startYearMonth || null,
        endYearMonth: currentFilter.endYearMonth || null,
        categories: currentFilter.categories.join(','),
      })
      setPresetName('')
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card section">
      <div className="field">
        <label>프리셋 이름</label>
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="예: 최근 식비"
        />
      </div>
      <button type="button" className="btn" onClick={handleSave} disabled={saving || !presetName}>
        {saving ? '저장 중...' : '이 조건으로 프리셋 저장'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default FilterPresetForm
