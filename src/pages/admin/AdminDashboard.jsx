import { Card, Col, Container, Row, Button } from 'react-bootstrap'

function AdminDashboard() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Dashboard Administrador</h1>
      <Row xs={1} md={3} className="g-4">
        <Col>
          <Card style={{ borderColor: '#5c148d' }}>
            <Card.Header style={{ backgroundColor: '#5c148d', color: '#fff' }}>
              Usuarios
            </Card.Header>
            <Card.Body>
              <Card.Text>Administra cuentas, roles y datos del sistema.</Card.Text>
              <Button href="/admin/users" style={{ backgroundColor: '#5c148d', borderColor: '#5c148d' }}>
                Ver usuarios
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#5c148d' }}>
            <Card.Header style={{ backgroundColor: '#5c148d', color: '#fff' }}>
              Salas
            </Card.Header>
            <Card.Body>
              <Card.Text>Gestiona las salas donde se imparten las clases.</Card.Text>
              <Button href="/admin/rooms" style={{ backgroundColor: '#5c148d', borderColor: '#5c148d' }}>
                Ver salas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#5c148d' }}>
            <Card.Header style={{ backgroundColor: '#5c148d', color: '#fff' }}>
              Asignaciones
            </Card.Header>
            <Card.Body>
              <Card.Text>Configura qué coach enseña qué deporte en qué sala.</Card.Text>
              <Button href="/admin/assignments" style={{ backgroundColor: '#5c148d', borderColor: '#5c148d' }}>
                Ver asignaciones
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#5c148d' }}>
            <Card.Header style={{ backgroundColor: '#5c148d', color: '#fff' }}>
              Horarios
            </Card.Header>
            <Card.Body>
              <Card.Text>Administra los horarios de clases activos.</Card.Text>
              <Button href="/admin/schedules" style={{ backgroundColor: '#5c148d', borderColor: '#5c148d' }}>
                Ver horarios
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
