import { apiFetch } from './httpClient'

export async function getRecurringExpenses() {
  const response = await apiFetch('/api/recurring')
  if (!response.ok) {
    throw new Error(`반복 지출 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function saveRecurringExpense(recurring) {
  const response = await apiFetch('/api/recurring', {
    method: 'POST',
    body: JSON.stringify(recurring),
  })
  if (!response.ok) {
    throw new Error(`반복 지출 등록 실패 (status ${response.status})`)
  }
}

export async function deleteRecurringExpense(recurringId) {
  const response = await apiFetch(`/api/recurring/${recurringId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`반복 지출 삭제 실패 (status ${response.status})`)
  }
}

export async function generateDueRecurringExpenses() {
  const response = await apiFetch('/api/recurring/generate-due', { method: 'POST' })
  if (!response.ok) {
    throw new Error(`반복 지출 생성 실패 (status ${response.status})`)
  }
  return response.json()
}
