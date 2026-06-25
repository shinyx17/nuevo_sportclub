import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  name: '',
  objective: '',
  duration: '',
  status: true,
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || '',
        objective: selectedSport.objective || '',
        duration: selectedSport.duration || '',
        status: selectedSport.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSport, show])

  const validate = () => {
    const fieldErrors = {}

    if (!formData.name.trim()) {
      fieldErrors.name = 'Nombre obligatorio.'
    }

    if (!formData.objective.trim()) {
      fieldErrors.objective = 'Objetivo obligatorio.'
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      fieldErrors.duration = 'Duración obligatoria.'
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
      objective: formData.objective.trim(),
      duration: Number(formData.duration),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedSport ? 'Editar Deporte' : 'Nuevo Deporte'}</Modal.Title>
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
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              isInvalid={Boolean(errors.objective)}
            />
            <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              isInvalid={Boolean(errors.duration)}
            />
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center gap-3">
            <Form.Check
              type="switch"
              id="sport-status-switch"
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

export default SportFormModal
