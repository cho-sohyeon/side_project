import { apiFetch } from './httpClient'

export async function getChatHistory() {
  const response = await apiFetch('/api/chat')
  if (!response.ok) {
    throw new Error(`대화 기록 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function sendChatMessage(message) {
  const response = await apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `메시지 전송 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function clearChatHistory() {
  const response = await apiFetch('/api/chat', { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(`대화 기록 삭제 실패 (status ${response.status})`)
  }
}
