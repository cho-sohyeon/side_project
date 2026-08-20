const QUESTIONS = [
  {
    code: 'Q1',
    text: '투자 시 원금 손실 가능성에 대해?',
    options: [
      { value: 'A', label: '원금 손실은 절대 원하지 않는다' },
      { value: 'B', label: '어느 정도 손실은 감수할 수 있다' },
      { value: 'C', label: '높은 수익을 위해 큰 손실도 감수한다' },
    ],
  },
  {
    code: 'Q2',
    text: '투자 경험은?',
    options: [
      { value: 'A', label: '예적금 위주, 투자 경험 거의 없음' },
      { value: 'B', label: '펀드/ETF 등 일부 경험 있음' },
      { value: 'C', label: '주식/코인 등 변동성 큰 자산 경험 있음' },
    ],
  },
  {
    code: 'Q3',
    text: '목돈이 생기면?',
    options: [
      { value: 'A', label: '안전한 곳에 그대로 둔다' },
      { value: 'B', label: '일부는 안전자산, 일부는 투자한다' },
      { value: 'C', label: '대부분을 수익률 높은 곳에 투자한다' },
    ],
  },
]

function InvestmentSurvey({ answers, onChange }) {
  return (
    <div className="card section">
      <h3>투자 성향 설문</h3>
      {QUESTIONS.map((question, index) => (
        <div className="field" key={question.code}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'none', fontSize: '13px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: answers[index] ? 'var(--accent-fill)' : 'var(--accent-soft)',
                color: 'var(--accent-strong)',
                fontSize: '11px',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            {question.text}
          </label>
          <div className="radio-group">
            {question.options.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={`investment-${question.code}`}
                  checked={answers[index] === option.value}
                  onChange={() => {
                    const next = [...answers]
                    next[index] = option.value
                    onChange(next)
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InvestmentSurvey
export { QUESTIONS as INVESTMENT_QUESTIONS }
