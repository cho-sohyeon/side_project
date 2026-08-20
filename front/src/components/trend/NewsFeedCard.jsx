import { extractDomain } from './tierPalette'

const TIER_LABELS = {
  NONE: '절약 없음',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  TODAY: '오늘의 이슈',
  HOUSING: '관심 토픽',
}

function NewsFeedCard({ card, tier }) {
  const hasImage = Boolean(card.imageUrl)

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'block',
        position: 'relative',
        flex: '0 0 auto',
        width: '260px',
        height: '380px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        color: '#FFFFFF',
        background: hasImage
          ? `linear-gradient(to bottom, rgba(92,61,0,0.1), rgba(92,61,0,0.75)), url(${card.imageUrl}) center/cover no-repeat`
          : `linear-gradient(135deg, var(--accent-strong), var(--accent-mid))`,
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 10px',
          borderRadius: '999px',
          background: 'rgba(92,61,0,0.55)',
          color: '#FFFFFF',
          fontSize: 'var(--font-size-caption)',
          fontWeight: 700,
        }}
      >
        {TIER_LABELS[tier] ?? tier}
      </span>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 16px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '24px',
            fontWeight: 900,
            lineHeight: 1.2,
            wordBreak: 'keep-all',
            textShadow: '0 1px 6px rgba(92,61,0,0.6)',
            color: '#FFFFFF',
          }}
        >
          {card.summary}
        </p>
        <p style={{ margin: '0 0 4px', fontSize: 'var(--font-size-body)', opacity: 0.85, color: '#FFFFFF' }}>{card.title}</p>
        <span style={{ fontSize: 'var(--font-size-caption)', opacity: 0.7, color: '#FFFFFF' }}>{extractDomain(card.url)}</span>
      </div>
    </a>
  )
}

export default NewsFeedCard
