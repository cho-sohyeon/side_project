import { useEffect, useState } from 'react'
import { getExpenses } from '../../api/expenseApi'
import { formatWon } from '../../utils/format'

function RecentTransactions({ refreshKey, onNavigate }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getExpenses()
      .then((expenses) => setItems(expenses.slice(0, 5)))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true))
  }, [refreshKey])

  if (!loaded) {
    return null
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>최근 거래</span>
        <button
          type="button"
          onClick={() => onNavigate('expense')}
          style={{ border: 'none', background: 'transparent', color: 'var(--accent-strong)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
        >
          전체보기
        </button>
      </div>
      {items.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>등록된 거래가 없어요.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {items.map((item) => {
            const isIncome = item.transactionType === 'INCOME'
            return (
              <div
                key={item.expenseId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.expenseDesc}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                    {item.expenseDate} · {item.category ?? (isIncome ? '수입' : '기타')}
                    {item.isSettlement ? ' · 정산' : ''}
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: isIncome ? 'var(--accent-strong)' : 'var(--color-text)' }}>
                  {isIncome ? '+' : '-'}{formatWon(item.amount)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
