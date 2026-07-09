import { getHeaders, fetchJson } from './apiService'

export async function getCoachDashboard() {
  return await fetchJson('/api/coach/dashboard', { method: 'GET', headers: getHeaders() }, 'Error al obtener resumen coach')
}

export async function getMyClasses() {
  return await fetchJson('/api/coach/my-classes', { method: 'GET', headers: getHeaders() }, 'Error al obtener mis clases')
}

export async function getMySchedules() {
  return await fetchJson('/api/coach/my-schedules', { method: 'GET', headers: getHeaders() }, 'Error al obtener mis horarios')
}

export async function getMyRooms() {
  return await fetchJson('/api/coach/my-rooms', { method: 'GET', headers: getHeaders() }, 'Error al obtener mis salas')
}
