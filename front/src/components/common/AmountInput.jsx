import { toDigits, formatAmountInput } from '../../utils/format'

// "원" 단위를 입력값과 분리된 접미사로 붙여서, 수정 시 백스페이스가 항상 숫자만 지우도록 한다.
function AmountInput({ value, onChange, placeholder = '금액', style, inputStyle }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-bg)',
        padding: '0 10px',
        ...style,
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={value ? formatAmountInput(value) : ''}
        onChange={(e) => onChange(toDigits(e.target.value))}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          padding: '10px 0',
          fontSize: '14px',
          color: 'var(--color-text)',
          ...inputStyle,
        }}
      />
      {value ? (
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: '4px' }}>원</span>
      ) : null}
    </div>
  )
}

export default AmountInput
