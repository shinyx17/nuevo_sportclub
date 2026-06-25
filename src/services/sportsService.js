import { getToken } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = `${BASE_URL}/api/sports`

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

function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('network')
  )
}

function backendConnectionMessage() {
  return 'No se pudo conectar al backend. Inicia el backend local en http://localhost:3000 y configura VITE_API_URL en .env.'
}

async function handleResponse(response, defaultMessage) {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || defaultMessage)
  }
  return data
}

export async function getSports() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(),
    })

    return await handleResponse(response, 'Error al obtener deportes')
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(backendConnectionMessage())
    }
    throw error
  }
}

export async function createSport(sportData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sportData),
    })

    return await handleResponse(response, 'Error al crear deporte')
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(backendConnectionMessage())
    }
    throw error
  }
}

export async function updateSport(id, sportData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(sportData),
    })

    return await handleResponse(response, 'Error al actualizar deporte')
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(backendConnectionMessage())
    }
    throw error
  }
}

export async function deleteSport(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })

    return await handleResponse(response, 'Error al eliminar deporte')
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(backendConnectionMessage())
    }
    throw error
  }
}

export async function toggleSportStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })

    return await handleResponse(response, 'Error al cambiar estado del deporte')
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(backendConnectionMessage())
    }
    throw error
  }
}
