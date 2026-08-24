import { apiFetch, setNickname, setSession, clearSession } from './httpClient'

export async function updateNickname(nickname) {
  const response = await apiFetch('/api/account/nickname', {
    method: 'PUT',
    body: JSON.stringify({ nickname }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `닉네임 수정 실패 (status ${response.status})`)
  }
  const saved = await response.text()
  setNickname(saved.replace(/^"|"$/g, ''))
  return saved
}

export async function changePassword(currentPassword, newPassword) {
  const response = await apiFetch('/api/account/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `비밀번호 변경 실패 (status ${response.status})`)
  }
  const data = await response.json()
  setSession(data.token, data.nickname)
  return data
}

export async function deleteAccount(password) {
  const response = await apiFetch('/api/account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `회원 탈퇴 실패 (status ${response.status})`)
  }
  clearSession()
}
