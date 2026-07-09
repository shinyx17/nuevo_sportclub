import { getToken } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function parseErrorData(data, defaultMessage) {
  if (!data) return defaultMessage
  if (data.message) {
    const details = data.errors
    if (Array.isArray(details)) {
      return `${data.message} ${details.map((err) => err.msg || err.message || err).join(' ')}`.trim()
    }
    if (typeof details === 'object' && details !== null) {
      return `${data.message} ${Object.values(details)
        .flat()
        .map((err) => (typeof err === 'string' ? err : err.message || ''))
        .filter(Boolean)
        .join(' ')}`.trim()
    }
    return data.message
  }
  if (Array.isArray(data.errors)) {
    return data.errors.map((err) => err.msg || err.message || err).join(' ')
  }
  if (typeof data.errors === 'object' && data.errors !== null) {
    return Object.values(data.errors)
      .flat()
      .map((err) => (typeof err === 'string' ? err : err.message || ''))
      .filter(Boolean)
      .join(' ')
  }
  return data.error || defaultMessage
}

async function fetchJson(endpoint, options, defaultMessage) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(parseErrorData(data, defaultMessage))
  }

  return data
}

export { getHeaders, fetchJson }
