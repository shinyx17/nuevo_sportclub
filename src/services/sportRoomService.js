import { getHeaders, fetchJson } from './apiService'

const API_URL = '/api/sport-rooms'

export async function getAssignments() {
  return await fetchJson(API_URL, { method: 'GET', headers: getHeaders() }, 'Error al obtener asignaciones')
}

export async function createAssignment(assignData) {
  return await fetchJson(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(assignData),
  }, 'Error al crear asignación')
}

export async function updateAssignment(id, assignData) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(assignData),
  }, 'Error al actualizar asignación')
}

export async function deleteAssignment(id) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }, 'Error al eliminar asignación')
}
