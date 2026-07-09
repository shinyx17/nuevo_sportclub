import { getHeaders, fetchJson } from './apiService'

export async function getMemberDashboard() {
  return await fetchJson('/api/member/dashboard', { method: 'GET', headers: getHeaders() }, 'Error al obtener resumen de miembro')
}

export async function getAvailableClasses(filters = {}) {
  const query = new URLSearchParams()
  if (filters.sport_id) query.append('sport_id', filters.sport_id)
  if (filters.room_id) query.append('room_id', filters.room_id)

  return await fetchJson(`/api/member/classes?${query.toString()}`, { method: 'GET', headers: getHeaders() }, 'Error al obtener clases disponibles')
}

export async function getClassDetail(id) {
  return await fetchJson(`/api/member/classes/${id}`, { method: 'GET', headers: getHeaders() }, 'Error al obtener detalles de la clase')
}

export async function getAvailableSports() {
  return await fetchJson('/api/member/sports', { method: 'GET', headers: getHeaders() }, 'Error al obtener deportes disponibles')
}

export async function getAvailableRooms() {
  return await fetchJson('/api/member/rooms', { method: 'GET', headers: getHeaders() }, 'Error al obtener salas disponibles')
}
