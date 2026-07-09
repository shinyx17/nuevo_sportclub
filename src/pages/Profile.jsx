import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { getUser, logout } from '../services/authService'

function Profile() {
  const navigate = useNavigate()
  const user = getUser()

  const roleBadgeStyle = useMemo(() => {
    if (user?.role === 'admin') {
      return { backgroundColor: '#6f42c1', borderColor: '#6f42c1' }
    }
    return {}
  }, [user?.role])

  const roleClass = user?.role ? `profile-header-${user.role}` : 'profile-header-user'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Container className="mt-5 page-fade">
      <Card className="profile-card shadow-sm overflow-hidden">
        <div className={`profile-header p-4 text-white ${roleClass}`}>
          <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
            <div>
              <h2 className="mb-1">Mi Perfil</h2>
              <p className="mb-0 opacity-75">Datos personales, rol y acceso rápido a tu dashboard.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate(`/${user?.role || 'user'}/dashboard`)}
              >
                Ir al dashboard
              </Button>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
        <Card.Body className="profile-body p-4">
          <Row className="align-items-center gy-4">
            <Col md={4} className="text-center">
              <div className={`profile-avatar profile-avatar-${user?.role || 'user'} mb-3`}>{user?.full_name?.charAt(0).toUpperCase() || 'S'}</div>
              <h4 className="mb-1">{user?.full_name || 'Usuario'}</h4>
              <Badge bg={user?.role === 'coach' ? 'success' : user?.role === 'user' ? 'primary' : 'secondary'} style={roleBadgeStyle}>
                {user?.role || 'Sin rol'}
              </Badge>
            </Col>

            <Col md={8}>
              <Row className="gy-3">
                <Col xs={12} sm={6}>
                  <div className="profile-info-box p-3 rounded-3">
                    <small className="text-secondary">Nombre completo</small>
                    <p className="mb-0">{user?.full_name || 'No disponible'}</p>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="profile-info-box p-3 rounded-3">
                    <small className="text-secondary">Correo electrónico</small>
                    <p className="mb-0">{user?.email || 'No disponible'}</p>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="profile-info-box p-3 rounded-3">
                    <small className="text-secondary">Descripción</small>
                    <p className="mb-0">
                      Esta sección muestra información básica de la sesión actual y permite navegar con facilidad dentro del SPA.
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile
