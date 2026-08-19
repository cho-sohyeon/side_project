import { useState } from 'react'

const CATEGORY_OPTIONS = ['식비', '교통', '쇼핑', '주거', '여가', '금융/투자', '기타']

function StatFilterForm({ initialFilter, onSearch }) {
  const [startYearMonth, setStartYearMonth] = useState(initialFilter?.startYearMonth ?? '')
  const [endYearMonth, setEndYearMonth] = useState(initialFilter?.endYearMonth ?? '')
  const [categories, setCategories] = useState(initialFilter?.categories ?? [])

  function toggleCategory(category) {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  function handleSearch() {
    onSearch({ startYearMonth, endYearMonth, categories })
  }

  return (
    <div>
      <h3>조회 조건</h3>
      <div>
        <label>
          시작 연월
          <input
            type="month"
            value={startYearMonth}
            onChange={(e) => setStartYearMonth(e.target.value)}
          />
        </label>
        <label>
          종료 연월
          <input
            type="month"
            value={endYearMonth}
            onChange={(e) => setEndYearMonth(e.target.value)}
          />
        </label>
      </div>
      <div>
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
      <button type="button" onClick={handleSearch}>
        조회
      </button>
    </div>
  )
}

export default StatFilterForm
export { CATEGORY_OPTIONS }
