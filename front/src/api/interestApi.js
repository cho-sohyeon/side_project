const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getInterestTopics() {
  const response = await fetch(`${BASE_URL}/api/interests`)
  if (!response.ok) {
    throw new Error(`관심 토픽 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function saveInterestTopics(topicCodes) {
  const response = await fetch(`${BASE_URL}/api/interests`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topicCodes),
  })
  if (!response.ok) {
    throw new Error(`관심 토픽 저장 실패 (status ${response.status})`)
  }
}
