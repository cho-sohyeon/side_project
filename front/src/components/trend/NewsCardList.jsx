import { useRef } from 'react'
import NewsFeedCard from './NewsFeedCard'

function NewsCardList({ cards, tier }) {
  const scrollRef = useRef(null)

  if (cards.length === 0) {
    return <p>표시할 뉴스가 없습니다.</p>
  }

  function scrollByCard(direction) {
    const container = scrollRef.current
    if (!container) return
    const cardWidth = container.firstChild?.offsetWidth ?? 300
    container.scrollBy({ left: direction * (cardWidth + 12), behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="이전 카드"
        style={{
          position: 'absolute',
          left: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(92,61,0,0.55)',
          color: '#FFFFFF',
          cursor: 'pointer',
        }}
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '12px',
          padding: '8px',
        }}
      >
        {cards.map((card) => (
          <NewsFeedCard key={card.url} card={card} tier={tier} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="다음 카드"
        style={{
          position: 'absolute',
          right: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(92,61,0,0.55)',
          color: '#FFFFFF',
          cursor: 'pointer',
        }}
      >
        ›
      </button>
    </div>
  )
}

export default NewsCardList
