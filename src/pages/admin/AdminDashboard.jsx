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
              Configuración
            </Card.Header>
            <Card.Body>
              <Card.Text>Controla la configuración general del sistema y permisos.</Card.Text>
              <Button variant="outline-dark">Ver configuración</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#5c148d' }}>
            <Card.Header style={{ backgroundColor: '#5c148d', color: '#fff' }}>
              Reportes
            </Card.Header>
            <Card.Body>
              <Card.Text>Visualiza actividad del sistema y usuarios recientes.</Card.Text>
              <Button variant="outline-dark">Ver reportes</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
