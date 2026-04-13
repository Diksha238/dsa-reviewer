const API_BASE = 'http://localhost:8080'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('dsa_token')
}

export function setToken(token: string) {
  localStorage.setItem('dsa_token', token)
}

export function clearToken() {
  localStorage.removeItem('dsa_token')
  localStorage.removeItem('dsa_user')
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('dsa_user')
  if (!u || u === 'undefined') return null
  try { return JSON.parse(u) } catch { return null }
}

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  setToken(data.token)
  localStorage.setItem('dsa_user', JSON.stringify({ name: data.name, email: data.email }))
  return data
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  setToken(data.token)
  localStorage.setItem('dsa_user', JSON.stringify({ name: data.name, email: data.email }))
  return data
}

export async function apiReview(code: string, language: string, problemDescription: string) {
  const res = await fetch(`${API_BASE}/api/review`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ code, language, problemDescription }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Review failed')
  return data
}

export async function apiHistory() {
  const res = await fetch(`${API_BASE}/api/review/history`, {
    headers: headers(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to load history')
  return data
}

export async function apiReviewById(id: string) {
  const res = await fetch(`${API_BASE}/api/review/${id}`, {
    headers: headers(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to load review')
  return data
}
