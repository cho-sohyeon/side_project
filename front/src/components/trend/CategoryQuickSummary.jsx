import { useEffect, useState } from 'react'
import { getExpenseStats } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const CATEGORY_COLORS = ['#FFB627', '#E6A200', '#7A5200', '#FFD98A', '#5C3D00', '#F2C464', '#B8860B']

function CategoryQuickSummary() {
  const [summaries, setSummaries] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const yearMonth = currentYearMonth()
    getExpenseStats({ startYearMonth: yearMonth, endYearMonth: yearMonth, categories: [] })
      .then((result) => setSummaries(result.categorySummaries))
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!summaries) {
    return <p className="muted">불러오는 중...</p>
  }

  return (
    <div className="card section">
      <h3 style={{ margin: 0 }}>이번 달 카테고리별 지출</h3>
      {summaries.length === 0 ? (
        <p className="muted">이번 달 등록된 지출이 없어요.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summaries.map((item, index) => (
            <div key={item.category ?? '기타'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.category ?? '미분류'}</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>
                  {formatWon(item.totalAmount)} <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>({item.ratio}%)</span>
                </span>
              </div>
              <div style={{ height: '6px', borderRadius: '999px', background: 'var(--accent-soft)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${item.ratio}%`,
                    height: '100%',
                    background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryQuickSummary
