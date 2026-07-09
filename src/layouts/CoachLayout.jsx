import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { logout, getUser } from '../services/authService'

function CoachLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Navbar style={{ backgroundColor: '#1f7a1f' }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>SportClub Coach</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/coach/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>
          </Nav>
          <span className="text-white me-3">{user?.full_name || 'Coach'}</span>
          <Button variant="outline-light" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  )
}

export default CoachLayout
