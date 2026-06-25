const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-1-eevt.onrender.com'
const API_URL = `${BASE_URL}/api/auth`

const DEMO_USERS = {
  'admin@demo.cl': {
    token: 'demo-admin-token',
    user: {
      id: 1,
      full_name: 'Demo Admin',
      email: 'admin@demo.cl',
      role: 'admin',
    },
  },
  'coach@demo.cl': {
    token: 'demo-coach-token',
    user: {
      id: 2,
      full_name: 'Demo Coach',
      email: 'coach@demo.cl',
      role: 'coach',
    },
  },
  'user@demo.cl': {
    token: 'demo-user-token',
    user: {
      id: 3,
      full_name: 'Demo Usuario',
      email: 'user@demo.cl',
      role: 'user',
    },
  },
}

const DEMO_PASSWORD = '123456'

export async function loginUser(credentials) {
  const email = credentials.email?.trim().toLowerCase()
  const password = credentials.password?.trim()

  const demoUser = DEMO_USERS[email]
  if (demoUser && password === DEMO_PASSWORD) {
    return {
      ok: true,
      message: 'Login exitoso (modo demo)',
      data: demoUser,
    }
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    return data
  } catch (error) {
    const storedUsers = JSON.parse(localStorage.getItem('offlineUsers') || '[]')
    const offlineUser = storedUsers.find(
      (user) => user.email.toLowerCase() === email && user.password === password,
    )

    if (offlineUser) {
      return {
        ok: true,
        message: 'Login exitoso (modo offline)',
        data: {
          token: `offline-token-${Date.now()}`,
          user: {
            id: offlineUser.id,
            full_name: offlineUser.full_name,
            email: offlineUser.email,
            role: offlineUser.role,
          },
        },
      }
    }

    throw new Error(
      error.message ||
        'No se pudo conectar con el backend. Usa las credenciales demo, registra un usuario o inicia el servidor.',
    )
  }
}

export function saveSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export async function registerUser(registrationData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors)
          ? data.errors.map((err) => err.msg || err.message || err).join(', ')
          : null) ||
        `Error al registrar usuario (${response.status})`

      throw new Error(message)
    }

    return data
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('network')

    if (isNetworkError) {
      const storedUsers = JSON.parse(localStorage.getItem('offlineUsers') || '[]')
      const existingUser = storedUsers.find((user) => user.email === registrationData.email)

      if (existingUser) {
        throw new Error('El correo ya está registrado')
      }

      const newUser = {
        id: storedUsers.length + 100,
        full_name: registrationData.full_name,
        email: registrationData.email,
        role: registrationData.role || 'user',
        password: registrationData.password,
      }

      const token = `offline-token-${Date.now()}`
      const offlineData = { token, user: { ...newUser, password: undefined } }

      localStorage.setItem('offlineUsers', JSON.stringify([...storedUsers, newUser]))

      return {
        ok: true,
        message: 'Registro exitoso (modo offline)',
        data: offlineData,
      }
    }

    throw new Error(error.message || 'No se pudo conectar con el backend. Usa las credenciales demo, registra un usuario o inicia el servidor.')
  }
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  const user = localStorage.getItem('user')

  if (!user || user === 'undefined' || user === 'null') {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
