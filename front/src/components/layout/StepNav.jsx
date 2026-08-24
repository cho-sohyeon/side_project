import './StepNav.css'

const ICONS = {
  home: '🏠',
  profile: '👤',
  goal: '🎯',
  expense: '✏️',
  savings: '💰',
  trend: '📈',
  chat: '💬',
}

function StepNav({ steps, currentIndex, onSelect }) {
  return (
    <nav className="bottom-nav">
      {steps.map((step, index) => {
        const active = index === currentIndex
        return (
          <button
            key={step.key}
            type="button"
            onClick={() => onSelect(index)}
            className={`bottom-nav-item${active ? ' active' : ''}`}
          >
            <span className="bottom-nav-icon">{ICONS[step.key]}</span>
            {step.label}
          </button>
        )
      })}
    </nav>
  )
}

export default StepNav
