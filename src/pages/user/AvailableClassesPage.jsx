import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { createReservation } from '../../services/reservationService'
import { getAvailableClasses, getAvailableRooms, getAvailableSports } from '../../services/memberService'

const WEEK_DAYS = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

function AvailableClassesPage() {
  const [classes, setClasses] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [filters, setFilters] = useState({ sport_id: '', room_id: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [classesResult, sportsResult, roomsResult] = await Promise.all([
        getAvailableClasses(filters),
        getAvailableSports(),
        getAvailableRooms(),
      ])
      setClasses(classesResult.data || [])
      setSports(sportsResult.data || [])
      setRooms(roomsResult.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const handleReserve = async (schedule) => {
    const result = await Swal.fire({
      title: 'Confirmar reserva',
      text: `Reservar clase el ${WEEK_DAYS[schedule.day_of_week] || 'día'} a las ${schedule.start_time}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reservar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    try {
      setSubmitting(true)
      await createReservation({ class_schedule_id: schedule.id })
      Swal.fire('Reservado', 'Tu reserva se ha creado correctamente.', 'success')
      loadData()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredSchedules = useMemo(() => {
    return classes.flatMap((sportRoom) =>
      (sportRoom.schedules || []).map((schedule) => ({
        ...schedule,
        sportRoom,
      })),
    )
  }, [classes])

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h3 className="mb-1">Clases Disponibles</h3>
              <p className="text-secondary mb-0">Explora horarios abiertos y reserva tu lugar en la clase.</p>
            </div>
          </div>

          <Row className="g-3">
            <Col md={4}>
              <Form.Select
                value={filters.sport_id}
                onChange={(e) => setFilters((prev) => ({ ...prev, sport_id: e.target.value }))}
              >
                <option value="">Filtrar por deporte</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filters.room_id}
                onChange={(e) => setFilters((prev) => ({ ...prev, room_id: e.target.value }))}
              >
                <option value="">Filtrar por sala</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2 mb-0">Cargando clases...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <p className="text-center text-secondary">No se encontraron horarios disponibles.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Deporte</th>
                  <th>Sala</th>
                  <th>Coach</th>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.sportRoom?.sport?.name || '—'}</td>
                    <td>{schedule.sportRoom?.room?.name || '—'}</td>
                    <td>{schedule.sportRoom?.coach?.full_name || schedule.sportRoom?.coach?.email || '—'}</td>
                    <td>{WEEK_DAYS[schedule.day_of_week] || '—'}</td>
                    <td>{schedule.start_time} - {schedule.end_time}</td>
                    <td>
                      <Badge bg={schedule.status ? 'success' : 'secondary'}>
                        {schedule.status ? 'Disponible' : 'No disponible'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleReserve(schedule)}
                        disabled={!schedule.status || submitting}
                      >
                        Reservar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default AvailableClassesPage
