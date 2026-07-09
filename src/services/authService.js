const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = `${BASE_URL}/api/auth`

const DEMO_USERS = {
  'admin@demo.cl': {
    token: 'demo-admin1-token',
    user: {
      id: 1,
      full_name: 'Demo Admin 1',
      email: 'admin1@demo.cl',
      role: 'admin',
    },
  },
  'admin1@demo.cl': {
    token: 'demo-admin1-token',
    user: {
      id: 1,
      full_name: 'Demo Admin 1',
      email: 'admin1@demo.cl',
      role: 'admin',
    },
  },
  'coach@demo.cl': {
    token: 'demo-coach1-token',
    user: {
      id: 2,
      full_name: 'Demo Coach 1',
      email: 'coach1@demo.cl',
      role: 'coach',
    },
  },
  'coach1@demo.cl': {
    token: 'demo-coach1-token',
    user: {
      id: 2,
      full_name: 'Demo Coach 1',
      email: 'coach1@demo.cl',
      role: 'coach',
    },
  },
  'user@demo.cl': {
    token: 'demo-user1-token',
    user: {
      id: 3,
      full_name: 'Demo User 1',
      email: 'user1@demo.cl',
      role: 'user',
    },
  },
  'user1@demo.cl': {
    token: 'demo-user1-token',
    user: {
      id: 3,
      full_name: 'Demo User 1',
      email: 'user1@demo.cl',
      role: 'user',
    },
  },
}

const DEMO_PASSWORDS = ['12345678', '123456']

function normalizeDemoCredentials(credentials) {
  const email = credentials.email?.trim().toLowerCase()
  const password = credentials.password?.trim()

  if (email === 'admin@demo.cl' || email === 'coach@demo.cl' || email === 'user@demo.cl') {
    return {
      email: email.replace('@demo.cl', '1@demo.cl'),
      password: password === '123456' ? '12345678' : password,
    }
  }

  return { email, password }
}

function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('network')
  )
}

function backendConnectionMessage() {
  return 'No se pudo conectar al backend. Asegúrate de iniciar el backend local en http://localhost:3000 y configurar VITE_API_URL en .env.'
}

export async function loginUser(credentials) {
  const normalized = normalizeDemoCredentials(credentials)
  const email = normalized.email
  const password = normalized.password

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(data?.message || 'Error al iniciar sesión')
    }

    return data
  } catch (error) {
    if (isNetworkError(error)) {
      const demoUser = DEMO_USERS[email]
      if (demoUser && DEMO_PASSWORDS.includes(password)) {
        return {
          ok: true,
          message: 'Login exitoso (modo demo)',
          data: demoUser,
        }
      }

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

      throw new Error(error.message || backendConnectionMessage())
    }

    throw new Error(error.message || 'Error al iniciar sesión')
  }
}

export function saveSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function formatErrorMessage(data, defaultMessage) {
  if (!data) return defaultMessage

  if (data.message) {
    const details = data.errors
    if (Array.isArray(details)) {
      const joined = details.map((err) => err.msg || err.message || err).join(' ')
      return `${data.message} ${joined}`.trim()
    }

    if (typeof details === 'object' && details !== null) {
      const joined = Object.values(details)
        .flat()
        .map((err) => (typeof err === 'string' ? err : err.message || ''))
        .filter(Boolean)
        .join(' ')
      return `${data.message} ${joined}`.trim()
    }

    return data.message
  }

  if (Array.isArray(data.errors)) {
    return data.errors.map((err) => err.msg || err.message || err).join(' ')
  }

  if (typeof data.errors === 'object' && data.errors !== null) {
    return Object.values(data.errors)
      .flat()
      .map((err) => (typeof err === 'string' ? err : err.message || ''))
      .filter(Boolean)
      .join(' ')
  }

  return data.error || defaultMessage
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
      const message = formatErrorMessage(data, `Error al registrar usuario (${response.status})`)
      const err = new Error(message)
      if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        err.fieldErrors = data.errors
      }
      throw err
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
  const token = localStorage.getItem('token')

  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('token')
    return null
  }

  return token
}

export function getUser() {
  const user = localStorage.getItem('user')

  if (!user || user === 'undefined' || user === 'null') {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
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
