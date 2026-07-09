import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap'
import { registerUser, saveSession } from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validateFullName = (value) => {
    const parts = value.trim().split(/\s+/)
    return parts.length >= 2 && parts.every((part) => part.length >= 2)
  }
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/.test(value)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSuccess('')

    const errors = {}

    if (!fullName.trim()) {
      errors.full_name = 'El nombre completo es obligatorio.'
    } else if (!validateFullName(fullName)) {
      errors.full_name = 'Ingresa nombre y apellido válidos.'
    } else if (fullName.length > 80) {
      errors.full_name = 'El nombre no puede tener más de 80 caracteres.'
    }

    if (!email.trim()) {
      errors.email = 'El correo es obligatorio.'
    } else if (!validateEmail(email)) {
      errors.email = 'Ingresa un correo válido.'
    } else if (email.length > 150) {
      errors.email = 'El correo no puede tener más de 150 caracteres.'
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria.'
    } else if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.'
    } else if (!validatePassword(password)) {
      errors.password = 'La contraseña debe incluir mayúscula, minúscula y número.'
    } else if (password.length > 32) {
      errors.password = 'La contraseña no puede tener más de 32 caracteres.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        full_name: fullName,
        email,
        password,
        role: 'user',
      })

      saveSession(result.data.token, result.data.user)
      setSuccess('Registro exitoso. Redirigiendo...')
      setTimeout(() => {
        navigate('/user/dashboard')
      }, 500)
    } catch (registrationError) {
      if (registrationError.fieldErrors) {
        setFieldErrors(registrationError.fieldErrors)
      }
      setError(registrationError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '24rem' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Registro SportClub</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre completo"
                value={fullName}
                maxLength={80}
                isInvalid={Boolean(fieldErrors.full_name)}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.full_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                maxLength={150}
                isInvalid={Boolean(fieldErrors.email)}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                maxLength={32}
                isInvalid={Boolean(fieldErrors.password)}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <p className="text-muted small">
              La contraseña debe tener 8-32 caracteres, incluir mayúscula, minúscula y número.
            </p>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Registrando...
                </>
              ) : (
                'Registrarme'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register
