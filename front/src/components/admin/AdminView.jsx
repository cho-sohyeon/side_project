import { useEffect, useState } from 'react'
import { getAdminUserSummaries } from '../../api/adminApi'
import { formatWon } from '../../utils/format'

const TIER_LABELS = {
  PLATINUM: '💎 플래티넘',
  GOLD: '🥇 골드',
  SILVER: '🥈 실버',
  BRONZE: '🥉 브론즈',
  NONE: '-',
}

const SPENDING_HABIT_LABELS = {
  PLANNED: '계획소비형',
  IMPULSIVE: '충동소비형',
  FRUGAL: '절약형',
}

const INVESTMENT_LABELS = {
  CONSERVATIVE: '안정형',
  NEUTRAL: '중립형',
  AGGRESSIVE: '공격형',
}

const AGE_HOUSEHOLD_LABELS = {
  YOUTH: '청년',
  NEWLYWED: '신혼부부',
  OTHER: '기타',
}

function formatDateTime(value) {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '960px' }}>
          <thead>
            <tr style={{ background: 'var(--accent-soft)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>아이디</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>닉네임</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>가입일</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>절약 티어</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>연령대/가구</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>소비습관</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>투자성향</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>기록 건수</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>총 지출</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>총 수입</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>마지막 지출일</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>마지막 로그인</th>
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
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{TIER_LABELS[u.savingsTier] ?? u.savingsTier ?? '-'}</td>
                <td style={{ padding: '10px 12px' }}>{AGE_HOUSEHOLD_LABELS[u.ageHouseholdType] ?? '-'}</td>
                <td style={{ padding: '10px 12px' }}>{SPENDING_HABIT_LABELS[u.spendingHabitType] ?? '-'}</td>
                <td style={{ padding: '10px 12px' }}>{INVESTMENT_LABELS[u.investmentPropensityType] ?? '-'}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{u.expenseCount}건</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatWon(u.totalExpenseAmount)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatWon(u.totalIncomeAmount)}</td>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{formatDateTime(u.lastExpenseAt)}</td>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{formatDateTime(u.lastLoginAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminView
