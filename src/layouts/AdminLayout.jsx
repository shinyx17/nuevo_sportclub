import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { logout, getUser } from '../services/authService'

function AdminLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Navbar style={{ backgroundColor: '#5c148d' }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>SportClub Admin</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/users">Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>
          </Nav>
          <span className="text-white me-3">{user?.full_name || 'Admin'}</span>
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

export default AdminLayout
