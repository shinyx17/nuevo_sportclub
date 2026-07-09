import { getHeaders, fetchJson } from './apiService'

const API_URL = '/api/rooms'

export async function getRooms() {
  return await fetchJson(API_URL, { method: 'GET', headers: getHeaders() }, 'Error al obtener salas')
}

export async function createRoom(roomData) {
  return await fetchJson(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  }, 'Error al crear sala')
}

export async function updateRoom(id, roomData) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  }, 'Error al actualizar sala')
}

export async function deleteRoom(id) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }, 'Error al eliminar sala')
}
