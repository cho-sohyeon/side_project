import { useEffect, useState } from 'react'
import { getAdminUserSummaries } from '../../api/adminApi'
import { formatWon } from '../../utils/format'

function AdminView() {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAdminUserSummaries()
      .then(setUsers)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return <p className="error-text">{error}</p>
  }

  if (!users) {
    return <p className="muted">불러오는 중...</p>
  }

  return (
    <section className="section">
      <div className="card">
        <h2 style={{ margin: '0 0 4px' }}>관리자 대시보드</h2>
        <p className="muted" style={{ margin: 0, fontSize: '13px' }}>전체 회원 {users.length}명</p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '560px' }}>
          <thead>
            <tr style={{ background: 'var(--accent-soft)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>아이디</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>닉네임</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>가입일</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>기록 건수</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>총 지출</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>총 수입</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px 12px' }}>
                  {u.username}
                  {u.role === 'ADMIN' && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--accent-strong)',
                        background: 'var(--accent-fill)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1px 6px',
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px 12px' }}>{u.nickname}</td>
                <td style={{ padding: '10px 12px' }}>{u.createdAt?.slice(0, 10)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{u.expenseCount}건</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatWon(u.totalExpenseAmount)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatWon(u.totalIncomeAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminView
