import { getHeaders, fetchJson } from './apiService'

const API_URL = '/api/class-schedules'

export async function getSchedules() {
  return await fetchJson(API_URL, { method: 'GET', headers: getHeaders() }, 'Error al obtener horarios')
}

export async function createSchedule(scheduleData) {
  return await fetchJson(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(scheduleData),
  }, 'Error al crear horario')
}

export async function updateSchedule(id, scheduleData) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(scheduleData),
  }, 'Error al actualizar horario')
}

export async function deleteSchedule(id) {
  return await fetchJson(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }, 'Error al eliminar horario')
}
