import { apiFetch, setSession, clearSession, getToken } from './httpClient'

async function parseErrorMessage(response, fallback) {
  const text = await response.text().catch(() => '')
  return text || fallback
}

export async function register({ username, password, nickname }) {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, nickname }),
  })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, `회원가입 실패 (status ${response.status})`))
  }
  const data = await response.json()
  setSession(data.token, data.nickname)
  return data
}

export async function login({ username, password }) {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, `로그인 실패 (status ${response.status})`))
  }
  const data = await response.json()
  setSession(data.token, data.nickname)
  return data
}

export async function logout() {
  const token = getToken()
  if (!token) {
    clearSession()
    return
  }
  await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  clearSession()
}
