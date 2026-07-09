import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  sport_room_id: '',
  day_of_week: '1',
  start_time: '08:00',
  end_time: '09:00',
  status: true,
}

const WEEK_DAYS = [
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
  { value: '7', label: 'Domingo' },
]

function ClassScheduleFormModal({ show, handleClose, handleSave, selectedSchedule, assignments }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSchedule) {
      setFormData({
        sport_room_id: selectedSchedule.sport_room_id || selectedSchedule.sportRoom?.id || '',
        day_of_week: String(selectedSchedule.day_of_week || '1'),
        start_time: selectedSchedule.start_time || '08:00',
        end_time: selectedSchedule.end_time || '09:00',
        status: selectedSchedule.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSchedule, show])

  const validate = () => {
    const fieldErrors = {}

    if (!formData.sport_room_id) fieldErrors.sport_room_id = 'Debe seleccionar una asignación.'
    if (!formData.start_time) fieldErrors.start_time = 'Hora de inicio requerida.'
    if (!formData.end_time) fieldErrors.end_time = 'Hora de término requerida.'
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      fieldErrors.end_time = 'La hora de término debe ser posterior a la hora de inicio.'
    }

    setErrors(fieldErrors)
    return Object.keys(fieldErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    handleSave({
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedSchedule ? 'Editar Horario' : 'Nuevo Horario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Asignación</Form.Label>
            <Form.Select
              name="sport_room_id"
              value={formData.sport_room_id}
              onChange={handleChange}
              isInvalid={Boolean(errors.sport_room_id)}
            >
              <option value="">Selecciona una asignación</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.sport?.name || 'Deporte'} / {assignment.room?.name || 'Sala'} / {assignment.coach?.full_name || assignment.coach?.email}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.sport_room_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
              {WEEK_DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de inicio</Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              isInvalid={Boolean(errors.start_time)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.start_time}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de término</Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              isInvalid={Boolean(errors.end_time)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.end_time}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center gap-3">
            <Form.Check
              type="switch"
              id="schedule-status-switch"
              label={formData.status ? 'Activo' : 'Inactivo'}
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ClassScheduleFormModal
