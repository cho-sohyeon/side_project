const TIER_LABELS = {
  NONE: '절약 없음',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
}

function TierBadge({ tier, savingsRate }) {
  const ratePercent = Number(savingsRate) * 100
  const gaugePercent = Math.min(100, Math.max(0, ratePercent))

  return (
    <div className="card">
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '999px',
          background: 'var(--accent-soft)',
          color: 'var(--accent-strong)',
          fontSize: 'var(--font-size-caption)',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        {TIER_LABELS[tier] ?? tier}
      </span>
      <p
        style={{
          fontSize: 'var(--font-size-stat)',
          fontWeight: 'var(--font-weight-stat)',
          color: 'var(--accent-strong)',
          margin: '0 0 8px',
        }}
      >
        {ratePercent.toFixed(1)}%
      </p>
      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '999px',
          background: 'var(--accent-soft)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${gaugePercent}%`,
            height: '100%',
            background: 'var(--accent-fill)',
            borderRadius: '999px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p className="muted" style={{ marginTop: '6px' }}>절약률</p>
    </div>
  )
}

export default TierBadge
