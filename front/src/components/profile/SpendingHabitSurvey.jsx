const QUESTIONS = [
  {
    code: 'Q1',
    text: '지출 전 주로 어떻게 하나요?',
    options: [
      { value: 'A', label: '미리 예산을 정하고 그 안에서 쓴다' },
      { value: 'B', label: '그때그때 필요하다 느끼면 바로 산다' },
      { value: 'C', label: '꼭 필요한지 며칠 고민한 뒤 산다' },
    ],
  },
  {
    code: 'Q2',
    text: '월급/용돈을 받으면?',
    options: [
      { value: 'A', label: '카테고리별로 나눠서 계획을 세운다' },
      { value: 'B', label: '딱히 계획 없이 쓰다 보면 없어진다' },
      { value: 'C', label: '먼저 저축부터 떼어놓는다' },
    ],
  },
  {
    code: 'Q3',
    text: '세일/할인 정보를 보면?',
    options: [
      { value: 'A', label: '원래 사려던 것만 할인 시기에 산다' },
      { value: 'B', label: '할인 중이면 안 사려던 것도 산다' },
      { value: 'C', label: '꼭 필요한 게 아니면 안 산다' },
    ],
  },
  {
    code: 'Q4',
    text: '지출 기록/가계부는?',
    options: [
      { value: 'A', label: '꾸준히 기록하고 점검한다' },
      { value: 'B', label: '거의 기록하지 않는다' },
      { value: 'C', label: '기록하며 지출을 최소화하려 한다' },
    ],
  },
  {
    code: 'Q5',
    text: '예상치 못한 지출이 생기면?',
    options: [
      { value: 'A', label: '다른 항목 예산을 조정해서 맞춘다' },
      { value: 'B', label: '일단 쓰고 나중에 생각한다' },
      { value: 'C', label: '최대한 줄이거나 안 쓸 방법을 찾는다' },
    ],
  },
]

function SpendingHabitSurvey({ answers, onChange }) {
  return (
    <div className="card section">
      <h3>소비습관 유형 설문</h3>
      {QUESTIONS.map((question, index) => (
        <div className="field" key={question.code}>
          <label>{question.code}. {question.text}</label>
          <div className="radio-group">
            {question.options.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={`spending-${question.code}`}
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

export default SpendingHabitSurvey
export { QUESTIONS as SPENDING_HABIT_QUESTIONS }
