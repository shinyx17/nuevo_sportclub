import { Card, Col, Container, Row, Button } from 'react-bootstrap'

function UserDashboard() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Dashboard Usuario</h1>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card style={{ borderColor: '#0d6efd' }}>
            <Card.Header style={{ backgroundColor: '#0d6efd', color: '#fff' }}>
              Mis reservas
            </Card.Header>
            <Card.Body>
              <Card.Text>Revisa tus reservas de clases y horarios disponibles.</Card.Text>
              <Button style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}>
                Ver reservas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#0d6efd' }}>
            <Card.Header style={{ backgroundColor: '#0d6efd', color: '#fff' }}>
              Clases disponibles
            </Card.Header>
            <Card.Body>
              <Card.Text>Explora clases disponibles y encuentra tu próxima sesión.</Card.Text>
              <Button variant="outline-dark">Ver clases</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default UserDashboard
