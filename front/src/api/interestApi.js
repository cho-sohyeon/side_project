import { apiFetch } from './httpClient'

export async function getInterestTopics() {
  const response = await apiFetch('/api/interests')
  if (!response.ok) {
    throw new Error(`관심 토픽 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function saveInterestTopics(topicCodes) {
  const response = await apiFetch('/api/interests', {
    method: 'PUT',
    body: JSON.stringify(topicCodes),
  })
  if (!response.ok) {
    throw new Error(`관심 토픽 저장 실패 (status ${response.status})`)
  }
}
