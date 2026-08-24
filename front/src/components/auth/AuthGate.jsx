import { useState } from 'react'
import { login, register } from '../../api/authApi'

function AuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isRegister = mode === 'register'

  function validate() {
    if (!isRegister) return null
    if (!/^[a-zA-Z0-9]{4,20}$/.test(username)) {
      return '아이디는 영문/숫자 4~20자로 입력해주세요.'
    }
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.'
    }
    if (nickname.length > 20) {
      return '닉네임은 20자 이하로 입력해주세요.'
    }
    return null
  }

  async function handleSubmit() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (isRegister) {
        await register({ username, password, nickname })
      } else {
        await login({ username, password })
      }
      onAuthenticated()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-frame" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="section" style={{ width: '84%' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '48px', margin: '0 0 8px' }}>🐷</p>
            <h2 style={{ margin: '0 0 4px' }}>TrendLedger</h2>
            <p className="muted" style={{ margin: 0 }}>
              {isRegister ? '새 계정을 만들어요' : '로그인하고 이어서 확인해보세요'}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              background: 'var(--accent-soft)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              gap: '4px',
            }}
          >
            {[
              { key: 'login', label: '로그인' },
              { key: 'register', label: '회원가입' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setMode(tab.key)
                  setError(null)
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === tab.key ? 'var(--color-surface)' : 'transparent',
                  color: mode === tab.key ? 'var(--accent-strong)' : 'var(--color-text-muted)',
                  boxShadow: mode === tab.key ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="field">
              <label>아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="영문/숫자 4~20자"
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? '8자 이상' : undefined}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>
            {isRegister && (
              <div className="field">
                <label>닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="화면에 표시될 이름"
                />
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleSubmit}
              disabled={loading || !username || !password || (isRegister && !nickname)}
            >
              {loading ? '처리 중...' : isRegister ? '회원가입' : '로그인'}
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthGate
