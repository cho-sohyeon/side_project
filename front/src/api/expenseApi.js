import { apiFetch } from './httpClient'

export async function analyzeExpense({ expenseDesc, amount, expenseDate }) {
  const response = await apiFetch('/api/expenses/analyze', {
    method: 'POST',
    body: JSON.stringify({ expenseDesc, amount, expenseDate: expenseDate || null }),
  })
  if (!response.ok) {
    throw new Error(`분석 요청 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function saveExpense(expense) {
  const response = await apiFetch('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    throw new Error(`등록 요청 실패 (status ${response.status})`)
  }
}

export async function saveExpensesBulk(expenses) {
  const response = await apiFetch('/api/expenses/bulk', {
    method: 'POST',
    body: JSON.stringify(expenses),
  })
  if (!response.ok) {
    throw new Error(`일괄 등록 실패 (status ${response.status})`)
  }
}

export async function updateExpense(expenseId, expense) {
  const response = await apiFetch(`/api/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    throw new Error(`수정 요청 실패 (status ${response.status})`)
  }
}

export async function deleteExpense(expenseId) {
  const response = await apiFetch(`/api/expenses/${expenseId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`삭제 요청 실패 (status ${response.status})`)
  }
}

export async function getExpenses() {
  const response = await apiFetch('/api/expenses')
  if (!response.ok) {
    throw new Error(`목록 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getExpenseSummary() {
  const response = await apiFetch('/api/expenses/summary')
  if (!response.ok) {
    throw new Error(`잔액 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getExpenseStats({ startYearMonth, endYearMonth, categories }) {
  const params = new URLSearchParams()
  if (startYearMonth) params.set('startYearMonth', startYearMonth)
  if (endYearMonth) params.set('endYearMonth', endYearMonth)
  if (categories && categories.length > 0) {
    categories.forEach((c) => params.append('categories', c))
  }
  const response = await apiFetch(`/api/expenses/stats?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`통계 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function savePreset(preset) {
  const response = await apiFetch('/api/filter-presets', {
    method: 'POST',
    body: JSON.stringify(preset),
  })
  if (!response.ok) {
    throw new Error(`프리셋 저장 실패 (status ${response.status})`)
  }
}

export async function getPresets() {
  const response = await apiFetch('/api/filter-presets')
  if (!response.ok) {
    throw new Error(`프리셋 목록 조회 실패 (status ${response.status})`)
  }
  return response.json()
}
