import { apiFetch } from './httpClient'

export async function getAdminUserSummaries() {
  const response = await apiFetch('/api/admin/users')
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `관리자 데이터 조회 실패 (status ${response.status})`)
  }
  return response.json()
}
