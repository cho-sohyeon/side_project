export function toDigits(value) {
  return value.replace(/[^0-9]/g, '')
}

export function formatAmountInput(value) {
  const digits = toDigits(String(value ?? ''))
  if (!digits) return ''
  return Number(digits).toLocaleString('ko-KR')
}

// 화면에 표시되는 모든 금액은 이 형식(0,000원)으로 통일한다.
export function formatWon(value) {
  return `${Math.round(Number(value ?? 0)).toLocaleString('ko-KR')}원`
}
