import { Navigate, Link } from 'react-router-dom'
import { getUser } from '../services/authService'

function Home() {
  const user = getUser()

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (user?.role === 'coach') {
    return <Navigate to="/coach/dashboard" replace />
  }

  if (user?.role === 'user') {
    return <Navigate to="/user/dashboard" replace />
  }

  return (
    <main className="home-hero d-flex align-items-center page-fade">
      <div className="container py-5">
        <div className="row align-items-center gx-5">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="hero-card p-5 shadow-sm rounded-4">
              <span className="badge bg-primary-soft mb-3">SportClub SPA</span>
              <h1 className="display-5 fw-bold">Gestión de miembros, roles y dashboards.</h1>
              <p className="lead text-secondary">
                Accede con tu cuenta, administra usuarios si eres admin, gestiona tu perfil y usa rutas protegidas según tu rol.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                <Link className="btn btn-primary btn-lg px-4" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-outline-secondary btn-lg px-4" to="/register">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="hero-panel p-4 rounded-4 shadow-sm">
              <h2 className="h5 mb-3">Dashboard por rol</h2>
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <strong className="text-primary">Usuario:</strong> acceso a su propio panel y perfil.
                </li>
                <li className="mb-3">
                  <strong className="text-success">Coach:</strong> navegación exclusiva y recursos específicos.
                </li>
                <li>
                  <strong className="text-purple">Admin:</strong> CRUD de usuarios y control total del sistema.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
