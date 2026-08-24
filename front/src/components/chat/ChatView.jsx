import { useEffect, useRef, useState } from 'react'
import { getChatHistory, sendChatMessage, clearChatHistory } from '../../api/chatApi'

const FAQ_QUESTIONS = [
  '이번 달 저축 가능한 금액이 얼마나 될까요?',
  '제 투자성향에 맞는 재테크는 뭐가 있을까요?',
  '예산을 초과했는데 어떻게 줄이면 좋을까요?',
  '청약통장을 어떻게 활용하면 좋을까요?',
  '지금 제 소비습관에서 고칠 점이 있을까요?',
  '목돈 모으는 팁을 알려주세요',
]

// AI 응답을 빈 줄 기준으로(없으면 줄바꿈 기준으로) 여러 개의 짧은 말풍선으로 쪼갠다.
function splitBubbles(content) {
  if (!content) return []
  const byBlankLine = content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  if (byBlankLine.length > 1) return byBlankLine
  return content.split('\n').map((s) => s.trim()).filter(Boolean)
}

function ChatView() {
  const [messages, setMessages] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [showFaq, setShowFaq] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    getChatHistory()
      .then((history) => {
        setMessages(history)
        setShowFaq(history.length === 0)
      })
      .catch(() => setMessages([]))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend(presetText) {
    const text = (presetText ?? input).trim()
    if (!text || sending) return
    setError(null)
    setInput('')
    setShowFaq(false)
    setMessages((prev) => [...prev, { messageId: `local-${Date.now()}`, role: 'user', content: text }])
    setSending(true)
    try {
      const reply = await sendChatMessage(text)
      setMessages((prev) => [...prev, reply])
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  async function handleClear() {
    if (!window.confirm('대화 기록을 전부 지울까요?')) return
    await clearChatHistory()
    setMessages([])
    setShowFaq(true)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!messages) {
    return <p className="muted">불러오는 중...</p>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100svh - 180px)',
        minHeight: '420px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
        <h2 style={{ margin: 0 }}>💬 재테크 상담</h2>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', fontSize: '12px', cursor: 'pointer' }}
          >
            대화 초기화
          </button>
        )}
      </div>

      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {messages.length === 0 && !showFaq && (
          <p className="muted" style={{ fontSize: '13px' }}>
            궁금한 걸 편하게 물어보세요.
          </p>
        )}
        {messages.map((m) =>
          splitBubbles(m.content).map((bubble, i) => (
            <div
              key={`${m.messageId}-${i}`}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '9px 13px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                lineHeight: 1.45,
                wordBreak: 'keep-all',
                whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'var(--accent-fill)' : 'var(--accent-soft)',
                color: m.role === 'user' ? 'var(--color-on-primary)' : 'var(--color-text)',
              }}
            >
              {bubble}
            </div>
          ))
        )}
        {sending && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '9px 13px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-soft)',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            생각 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showFaq && (
        <div style={{ marginBottom: '10px', flexShrink: 0 }}>
          <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            💡 무엇을 물어볼지 모르겠다면
          </p>
          <div className="chip-list">
            {FAQ_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="chip"
                onClick={() => handleSend(q)}
                style={{ fontSize: '12px' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {!showFaq && (
          <button
            type="button"
            onClick={() => setShowFaq(true)}
            aria-label="추천 질문"
            style={{
              flexShrink: 0,
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-sm)',
              width: '44px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            💡
          </button>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="궁금한 걸 물어보세요"
          rows={1}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '12px 14px',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            resize: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleSend()}
          disabled={sending || !input.trim()}
          style={{ flexShrink: 0 }}
        >
          전송
        </button>
      </div>
      {error && <p className="error-text" style={{ flexShrink: 0 }}>{error}</p>}
      <p className="muted" style={{ fontSize: '10.5px', margin: '4px 0 0', flexShrink: 0 }}>
        AI가 생성한 참고용 정보이며, 투자 권유가 아닙니다.
      </p>
    </div>
  )
}

export default ChatView
