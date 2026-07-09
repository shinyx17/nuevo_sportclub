import { getHeaders, fetchJson } from './apiService'

const API_URL = '/api/reservations'

export async function getMyReservations() {
  return await fetchJson(`${API_URL}/my-reservations`, { method: 'GET', headers: getHeaders() }, 'Error al obtener reservas')
}

export async function createReservation(reservationData) {
  return await fetchJson(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reservationData),
  }, 'Error al crear reserva')
}

export async function cancelReservation(id) {
  return await fetchJson(`${API_URL}/${id}/cancel`, {
    method: 'PATCH',
    headers: getHeaders(),
  }, 'Error al cancelar reserva')
}
