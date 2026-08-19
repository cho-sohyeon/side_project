const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getProfile() {
  const response = await fetch(`${BASE_URL}/api/profile`)
  if (!response.ok) {
    throw new Error(`프로필 조회 실패 (status ${response.status})`)
  }
  return response.json()
}

export async function registerProfile(profile) {
  const response = await fetch(`${BASE_URL}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!response.ok) {
    throw new Error(`프로필 등록 실패 (status ${response.status})`)
  }
}

export async function updateProfile(profile) {
  const response = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!response.ok) {
    throw new Error(`프로필 수정 실패 (status ${response.status})`)
  }
}
