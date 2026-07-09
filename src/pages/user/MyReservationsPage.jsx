import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { cancelReservation, getMyReservations } from '../../services/reservationService'

const WEEK_DAYS = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const loadReservations = async () => {
    try {
      setLoading(true)
      const data = await getMyReservations()
      setReservations(data.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleCancel = async (reservation) => {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Se cancelará la reserva para ${WEEK_DAYS[reservation.classSchedule?.day_of_week] || 'este horario'} a las ${reservation.classSchedule?.start_time}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
    })

    if (!result.isConfirmed) return

    try {
      setCancelling(true)
      await cancelReservation(reservation.id)
      Swal.fire('Cancelado', 'La reserva se ha cancelado correctamente.', 'success')
      loadReservations()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setCancelling(false)
    }
  }

  const activeReservations = useMemo(
    () => (reservations || []).filter((item) => item.status === 'active'),
    [reservations],
  )

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
          <div>
            <h3 className="mb-1">Mis Reservas</h3>
            <p className="text-secondary mb-0">Revisa y cancela tus reservas activas.</p>
          </div>
          <Button variant="outline-primary" onClick={loadReservations} disabled={loading}>
            Refrescar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2 mb-0">Cargando reservas...</p>
          </div>
        ) : activeReservations.length === 0 ? (
          <p className="text-center text-secondary">No tienes reservas activas.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Clase</th>
                <th>Coach</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activeReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.classSchedule?.sportRoom?.sport?.name || '—'}</td>
                  <td>{reservation.classSchedule?.sportRoom?.coach?.full_name || '—'}</td>
                  <td>{WEEK_DAYS[reservation.classSchedule?.day_of_week] || '—'}</td>
                  <td>{reservation.classSchedule?.start_time} - {reservation.classSchedule?.end_time}</td>
                  <td>
                    <Badge bg={reservation.status === 'active' ? 'success' : 'secondary'}>
                      {reservation.status === 'active' ? 'Activa' : 'Cancelada'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancel(reservation)}
                      disabled={cancelling}
                    >
                      Cancelar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default MyReservationsPage
