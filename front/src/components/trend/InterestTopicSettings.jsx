import { useEffect, useState } from 'react'
import { getInterestTopics, saveInterestTopics } from '../../api/interestApi'

const TOPIC_CATALOG = [
  { code: 'SUBSCRIPTION', label: '청약' },
  { code: 'HAPPY_HOUSING', label: '행복주택' },
  { code: 'REAL_ESTATE_POLICY', label: '부동산 대책' },
  { code: 'STOCK', label: '주식' },
  { code: 'ETF', label: 'ETF' },
  { code: 'CRYPTO', label: '코인' },
  { code: 'SAVINGS', label: '예적금' },
  { code: 'TAX_SAVING', label: '절세' },
  { code: 'BOND', label: '채권' },
  { code: 'FUND', label: '펀드' },
]

function InterestTopicSettings({ onSaved }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getInterestTopics()
      .then(setSelected)
      .catch(() => setSelected([]))
  }, [])

  function toggle(code) {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await saveInterestTopics(selected)
      setOpen(false)
      onSaved && onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: 0,
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--color-text)',
        }}
      >
        ⚙️ 관심 토픽 설정
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{open ? '접기 ▲' : '펼치기 ▼'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '12px' }}>
          <p className="muted" style={{ margin: '0 0 10px', fontSize: '12px' }}>
            관심 있는 재테크 주제를 골라두면 홈/투자트렌드의 관심 토픽 뉴스가 여기에 맞춰져요.
          </p>
          <div className="chip-list">
            {TOPIC_CATALOG.map((topic) => (
              <label
                key={topic.code}
                className="chip"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: selected.includes(topic.code) ? 'var(--accent-soft)' : 'var(--color-surface)',
                  borderColor: selected.includes(topic.code) ? 'var(--accent-fill)' : 'var(--color-border)',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(topic.code)}
                  onChange={() => toggle(topic.code)}
                  style={{ margin: 0 }}
                />
                {topic.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: '12px' }}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          {error && <p className="error-text" style={{ margin: '8px 0 0' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

export default InterestTopicSettings
