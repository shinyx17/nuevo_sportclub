import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  name: '',
  description: '',
  capacity: 1,
  location: '',
  observation: '',
  status: true,
}

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || '',
        description: selectedRoom.description || '',
        capacity: selectedRoom.capacity || 1,
        location: selectedRoom.location || '',
        observation: selectedRoom.observation || '',
        status: selectedRoom.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedRoom, show])

  const validate = () => {
    const fieldErrors = {}

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      fieldErrors.name = 'El nombre debe tener al menos 3 caracteres.'
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      fieldErrors.description = 'La descripción debe tener al menos 5 caracteres.'
    }
    if (!formData.capacity || Number(formData.capacity) < 1) {
      fieldErrors.capacity = 'La capacidad debe ser mayor a 0.'
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
      name: formData.name.trim(),
      description: formData.description.trim(),
      capacity: Number(formData.capacity),
      location: formData.location.trim(),
      observation: formData.observation.trim(),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedRoom ? 'Editar Sala' : 'Nueva Sala'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={Boolean(errors.name)}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={Boolean(errors.description)}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              isInvalid={Boolean(errors.capacity)}
            />
            <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
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
              id="room-status-switch"
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

export default RoomFormModal
