const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getTrendGuide() {
  const response = await fetch(`${BASE_URL}/api/trend-guide`)
  if (!response.ok) {
    throw new Error(`트렌드 가이드 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getTodayIssues() {
  const response = await fetch(`${BASE_URL}/api/trend-guide/today-issues`)
  if (!response.ok) {
    throw new Error(`오늘의 이슈 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function getInterestIssues() {
  const response = await fetch(`${BASE_URL}/api/trend-guide/interest-issues`)
  if (!response.ok) {
    throw new Error(`관심 토픽 뉴스 조회 실패 (status ${response.status})`)
  }
  return response.json()
}
