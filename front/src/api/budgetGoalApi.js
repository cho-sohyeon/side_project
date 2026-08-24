import { apiFetch } from './httpClient'

export async function getBudgetGoal(yearMonth) {
  const response = await apiFetch(`/api/budget-goals/${yearMonth}`)
  if (!response.ok) {
    throw new Error(`예산 목표 조회 실패 (status ${response.status})`)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function saveBudgetGoal({ yearMonth, targetAmount }) {
  const response = await apiFetch('/api/budget-goals', {
    method: 'POST',
    body: JSON.stringify({ yearMonth, targetAmount }),
  })
  if (!response.ok) {
    throw new Error(`예산 목표 저장 실패 (status ${response.status})`)
  }
}
