import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  full_name: '',
  email: '',
  role: 'user',
  password: '',
}

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || 'user',
        password: '',
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedUser, show])

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/.test(value)

  const validate = () => {
    const fieldErrors = {}

    if (!formData.full_name.trim()) {
      fieldErrors.full_name = 'El nombre completo es obligatorio.'
    } else if (formData.full_name.trim().length < 3) {
      fieldErrors.full_name = 'El nombre completo debe tener al menos 3 caracteres.'
    }

    if (!formData.email.trim()) {
      fieldErrors.email = 'El correo es obligatorio.'
    } else if (!validateEmail(formData.email)) {
      fieldErrors.email = 'El correo no tiene un formato válido.'
    }

    if (!selectedUser) {
      if (!formData.password) {
        fieldErrors.password = 'La contraseña es obligatoria.'
      } else if (!validatePassword(formData.password)) {
        fieldErrors.password = 'La contraseña debe tener 8-32 caracteres e incluir mayúscula, minúscula y número.'
      }
    } else if (formData.password && !validatePassword(formData.password)) {
      fieldErrors.password = 'La contraseña debe tener 8-32 caracteres e incluir mayúscula, minúscula y número.'
    }

    setErrors(fieldErrors)
    return Object.keys(fieldErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    handleSave(formData)
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              isInvalid={Boolean(errors.full_name)}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.full_name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              isInvalid={Boolean(errors.email)}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {!selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                isInvalid={Boolean(errors.password)}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                isInvalid={Boolean(errors.password)}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Deja la contraseña vacía si no deseas cambiarla.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
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

export default UserFormModal
