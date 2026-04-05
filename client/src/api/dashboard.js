const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

const handleResponse = async (response) => {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message || 'Server error')
  }
  return body
}

export const fetchDashboard = async () => {
  const response = await fetch(`${API_BASE}/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  return handleResponse(response)
}

export const fetchSidebarItems = async () => {
  const response = await fetch(`${API_BASE}/sidebar`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  return handleResponse(response)
}

export const executeSidebarAction = async (actionId, payload = {}) => {
  const response = await fetch(`${API_BASE}/sidebar/${actionId}/execute`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const dismissAlert = async (alertId) => {
  const response = await fetch(`${API_BASE}/alerts/${alertId}/dismiss`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  return handleResponse(response)
}
