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
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
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
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <p className="text-muted small">
              Si el backend no está disponible, el registro se guardará en localStorage y funcionará como modo offline.
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
