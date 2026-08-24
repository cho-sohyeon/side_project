import { apiFetch } from './httpClient'

export async function getCategoryBudgetStatus(yearMonth) {
  const response = await apiFetch(`/api/category-budgets/${yearMonth}`)
  if (!response.ok) {
    throw new Error(`카테고리 예산 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function saveCategoryBudget({ yearMonth, category, targetAmount }) {
  const response = await apiFetch('/api/category-budgets', {
    method: 'POST',
    body: JSON.stringify({ yearMonth, category, targetAmount }),
  })
  if (!response.ok) {
    throw new Error(`카테고리 예산 저장 실패 (status ${response.status})`)
  }
}

export async function deleteCategoryBudget(yearMonth, category) {
  const response = await apiFetch(`/api/category-budgets/${yearMonth}/${encodeURIComponent(category)}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`카테고리 예산 삭제 실패 (status ${response.status})`)
  }
}
