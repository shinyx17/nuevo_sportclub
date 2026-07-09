import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { logout, getUser } from '../services/authService'

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Navbar style={{ backgroundColor: '#0d6efd' }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>SportClub Usuario</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/user/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/user/classes">Clases</Nav.Link>
            <Nav.Link as={Link} to="/user/reservations">Reservas</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>
          </Nav>
          <span className="text-white me-3">{user?.full_name || 'Usuario'}</span>
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

export default UserLayout
