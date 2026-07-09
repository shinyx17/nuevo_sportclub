import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  sport_id: '',
  room_id: '',
  coach_id: '',
  observation: '',
  status: true,
}

function SportRoomFormModal({ show, handleClose, handleSave, selectedAssignment, sports, rooms, coaches }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedAssignment) {
      setFormData({
        sport_id: selectedAssignment.sport_id || selectedAssignment.sport?.id || '',
        room_id: selectedAssignment.room_id || selectedAssignment.room?.id || '',
        coach_id: selectedAssignment.coach_id || selectedAssignment.coach?.id || '',
        observation: selectedAssignment.observation || '',
        status: selectedAssignment.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedAssignment, show])

  const validate = () => {
    const fieldErrors = {}

    if (!formData.sport_id) fieldErrors.sport_id = 'Debe seleccionar un deporte.'
    if (!formData.room_id) fieldErrors.room_id = 'Debe seleccionar una sala.'
    if (!formData.coach_id) fieldErrors.coach_id = 'Debe seleccionar un coach.'

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
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
      observation: formData.observation.trim(),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedAssignment ? 'Editar Asignación' : 'Nueva Asignación'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange} isInvalid={Boolean(errors.sport_id)}>
              <option value="">Selecciona un deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.sport_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select name="room_id" value={formData.room_id} onChange={handleChange} isInvalid={Boolean(errors.room_id)}>
              <option value="">Selecciona una sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange} isInvalid={Boolean(errors.coach_id)}>
              <option value="">Selecciona un coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.full_name || coach.email}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.coach_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observation"
              value={formData.observation}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center gap-3">
            <Form.Check
              type="switch"
              id="assignment-status-switch"
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

export default SportRoomFormModal
