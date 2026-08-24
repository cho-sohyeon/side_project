const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = 'trendledger_auth_token'
const NICKNAME_KEY = 'trendledger_nickname'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getNickname() {
  return localStorage.getItem(NICKNAME_KEY)
}

export function setSession(token, nickname) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(NICKNAME_KEY, nickname)
}

export function setNickname(nickname) {
  localStorage.setItem(NICKNAME_KEY, nickname)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(NICKNAME_KEY)
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['X-Auth-Token'] = token
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error(`서버(${BASE_URL})에 연결할 수 없어요. 백엔드가 켜져 있는지, 주소가 맞는지 확인해주세요.`)
  }

  if (response.status === 401) {
    clearSession()
    window.dispatchEvent(new Event('trendledger:unauthorized'))
  }
  return response
}
