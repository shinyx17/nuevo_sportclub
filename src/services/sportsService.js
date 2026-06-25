import { getToken } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-1-eevt.onrender.com'
const API_URL = `${BASE_URL}/api/sports`

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getSports() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener deportes')
  }

  return data
}

export async function createSport(sportData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(sportData),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear deporte')
  }

  return data
}

export async function updateSport(id, sportData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(sportData),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar deporte')
  }

  return data
}

export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar deporte')
  }

  return data
}

export async function toggleSportStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Error al cambiar estado del deporte')
  }

  return data
}
