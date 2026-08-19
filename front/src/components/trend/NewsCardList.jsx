function NewsCardList({ cards }) {
  if (cards.length === 0) {
    return <p>표시할 뉴스가 없습니다.</p>
  }

  return (
    <div>
      {cards.map((card) => (
        <a
          key={card.url}
          href={card.url}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}
        >
          <strong>{card.title}</strong>
          <p>{card.summary}</p>
        </a>
      ))}
    </div>
  )
}

export default NewsCardList
