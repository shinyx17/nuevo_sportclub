import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Form, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import ClassScheduleFormModal from '../../components/classSchedules/ClassScheduleFormModal'
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from '../../services/classScheduleService'
import { getAssignments } from '../../services/sportRoomService'

const WEEK_DAYS = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

function SchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [filterDay, setFilterDay] = useState('all')

  const loadSchedules = async () => {
    try {
      setLoading(true)
      const [scheduleResult, assignmentResult] = await Promise.all([getSchedules(), getAssignments()])
      setSchedules(scheduleResult.data || [])
      setAssignments(assignmentResult.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedules()
  }, [])

  const openCreateModal = () => {
    setSelectedSchedule(null)
    setShowModal(true)
  }

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSchedule(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, formData)
        Swal.fire('Actualizado', 'Horario actualizado correctamente', 'success')
      } else {
        await createSchedule(formData)
        Swal.fire('Creado', 'Horario creado correctamente', 'success')
      }
      closeModal()
      loadSchedules()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: '¿Eliminar horario?',
      text: `Se eliminará el horario de ${WEEK_DAYS[schedule.day_of_week] || 'día desconocido'} ${schedule.start_time}-${schedule.end_time}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteSchedule(schedule.id)
        Swal.fire('Eliminado', 'Horario eliminado correctamente', 'success')
        loadSchedules()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  const filteredSchedules = schedules.filter((schedule) => {
    if (filterDay === 'all') return true
    return String(schedule.day_of_week) === filterDay
  })

  const statusBadge = useMemo(
    () => ({
      true: { text: 'Activo', variant: 'success' },
      false: { text: 'Inactivo', variant: 'secondary' },
    }),
    [],
  )

  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h3 className="mb-1">Gestión de Horarios</h3>
              <p className="text-secondary mb-0">Administra los horarios vigentes para las clases de cada asignación.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-primary" onClick={loadSchedules}>
                Refrescar
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nuevo Horario
              </Button>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="weekdayFilter">
            <Form.Label>Filtrar por día</Form.Label>
            <Form.Select value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
              <option value="all">Todos los días</option>
              {Object.entries(WEEK_DAYS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2 mb-0">Cargando horarios...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <p className="text-center text-secondary">No hay horarios registrados.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asignación</th>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Coach</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td>{schedule.sportRoom?.sport?.name || '—'} / {schedule.sportRoom?.room?.name || '—'}</td>
                    <td>{WEEK_DAYS[schedule.day_of_week] || '—'}</td>
                    <td>{schedule.start_time} - {schedule.end_time}</td>
                    <td>{schedule.sportRoom?.coach?.full_name || schedule.sportRoom?.coach?.email || '—'}</td>
                    <td>
                      <Badge bg={statusBadge[Boolean(schedule.status)].variant}>
                        {statusBadge[Boolean(schedule.status)].text}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditModal(schedule)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(schedule)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <ClassScheduleFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSchedule={selectedSchedule}
        assignments={assignments}
      />
    </>
  )
}

export default SchedulesPage
