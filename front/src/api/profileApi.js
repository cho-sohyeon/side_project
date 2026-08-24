import { apiFetch } from './httpClient'

export async function getProfile() {
  const response = await apiFetch('/api/profile')
  if (!response.ok) {
    throw new Error(`프로필 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function registerProfile(profile) {
  const response = await apiFetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
  })
  if (!response.ok) {
    throw new Error(`프로필 등록 실패 (status ${response.status})`)
  }
}

export async function updateProfile(profile) {
  const response = await apiFetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
  if (!response.ok) {
    throw new Error(`프로필 수정 실패 (status ${response.status})`)
  }
}
