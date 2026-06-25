import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
      <Link to="/">Inicio</Link>
      <Link to="/login">Login</Link>
      <Link to="/user/dashboard">Usuario</Link>
      <Link to="/coach/dashboard">Coach</Link>
      <Link to="/admin/dashboard">Admin</Link>
    </nav>
  )
}

export default Navbar
