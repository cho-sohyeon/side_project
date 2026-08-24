import { apiFetch } from './httpClient'

export async function getTrendGuide(refresh = false) {
  const response = await apiFetch(`/api/trend-guide${refresh ? '?refresh=true' : ''}`)
  if (!response.ok) {
    throw new Error(`트렌드 가이드 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getTodayIssues(refresh = false) {
  const response = await apiFetch(`/api/trend-guide/today-issues${refresh ? '?refresh=true' : ''}`)
  if (!response.ok) {
    throw new Error(`오늘의 이슈 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getInterestIssues(refresh = false) {
  const response = await apiFetch(`/api/trend-guide/interest-issues${refresh ? '?refresh=true' : ''}`)
  if (!response.ok) {
    throw new Error(`관심 토픽 뉴스 조회 실패 (status ${response.status})`)
  }
  return response.json()
}
