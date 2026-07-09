import { Card, Col, Container, Row, Button } from 'react-bootstrap'

function CoachDashboard() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Dashboard Coach</h1>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card style={{ borderColor: '#1f7a1f' }}>
            <Card.Header style={{ backgroundColor: '#1f7a1f', color: '#fff' }}>
              Clases activas
            </Card.Header>
            <Card.Body>
              <Card.Text>Administra tus clases y revisa los alumnos inscritos.</Card.Text>
              <Button style={{ backgroundColor: '#1f7a1f', borderColor: '#1f7a1f' }}>
                Ver clases
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ borderColor: '#1f7a1f' }}>
            <Card.Header style={{ backgroundColor: '#1f7a1f', color: '#fff' }}>
              Mi agenda
            </Card.Header>
            <Card.Body>
              <Card.Text>Consulta tus horarios y organiza tus sesiones.</Card.Text>
              <Button variant="outline-dark">Ver agenda</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CoachDashboard
