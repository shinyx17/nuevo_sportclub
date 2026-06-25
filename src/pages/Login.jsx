import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap'
import { loginUser, saveSession } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa correo y contraseña.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      if (data.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (data.data.user.role === 'coach') {
        navigate('/coach/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '24rem' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">SportClub Login</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register">¿No tienes cuenta? Regístrate</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
