import { useState } from 'react'

const CATEGORY_OPTIONS = ['식비', '교통', '쇼핑', '주거', '여가', '금융/투자', '기타']

function StatFilterForm({ initialFilter, onSearch }) {
  const [startYearMonth, setStartYearMonth] = useState(initialFilter?.startYearMonth ?? '')
  const [endYearMonth, setEndYearMonth] = useState(initialFilter?.endYearMonth ?? '')
  const [categories, setCategories] = useState(initialFilter?.categories ?? [])
  const [showCategories, setShowCategories] = useState(false)

  function toggleCategory(category) {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  function handleSearch() {
    onSearch({ startYearMonth, endYearMonth, categories })
  }

  return (
    <div className="card section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>조회 조건</h3>
        <button
          type="button"
          onClick={() => setShowCategories((prev) => !prev)}
          aria-label="카테고리 필터"
          style={{
            border: 'none',
            background: showCategories ? 'var(--accent-soft)' : 'transparent',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'var(--accent-strong)',
          }}
        >
          ☰
        </button>
      </div>
      <div className="field-row">
        <div className="field">
          <label>시작 연월</label>
          <input
            type="month"
            value={startYearMonth}
            onChange={(e) => setStartYearMonth(e.target.value)}
          />
        </div>
        <div className="field">
          <label>종료 연월</label>
          <input
            type="month"
            value={endYearMonth}
            onChange={(e) => setEndYearMonth(e.target.value)}
          />
        </div>
      </div>
      {showCategories && (
        <div className="field">
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={categories.length === 0}
                onChange={() => setCategories([])}
              />
              전체
            </label>
            {CATEGORY_OPTIONS.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={categories.includes(option)}
                  onChange={() => toggleCategory(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="btn btn-primary" onClick={handleSearch}>
        조회
      </button>
    </div>
  )
}

export default StatFilterForm
export { CATEGORY_OPTIONS }
