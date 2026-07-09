const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = `${BASE_URL}/api/users`
const OFFLINE_USERS_KEY = 'offlineUsers'

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('network')
  )
}

function parseErrorData(data, defaultMessage) {
  if (!data) return defaultMessage
  if (data.message) {
    const details = data.errors
    if (Array.isArray(details)) {
      return `${data.message} ${details.map((err) => err.msg || err.message || err).join(' ')}`.trim()
    }
    if (typeof details === 'object' && details !== null) {
      return `${data.message} ${Object.values(details)
        .flat()
        .map((err) => (typeof err === 'string' ? err : err.message || ''))
        .filter(Boolean)
        .join(' ')}`.trim()
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

function readOfflineUsers() {
  return JSON.parse(localStorage.getItem(OFFLINE_USERS_KEY) || '[]')
}

function saveOfflineUsers(users) {
  localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users))
}

function normalizeUser(user) {
  const { password, ...rest } = user
  return rest
}

async function fetchJson(url, options, defaultMessage) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(parseErrorData(data, defaultMessage))
  }

  return data
}

export async function getUsers() {
  try {
    return await fetchJson(API_URL, { method: 'GET', headers: getHeaders() }, 'Error al obtener usuarios')
  } catch (error) {
    if (isNetworkError(error)) {
      const offlineUsers = readOfflineUsers().map(normalizeUser)
      return { ok: true, data: offlineUsers }
    }
    throw error
  }
}

export async function createUser(userData) {
  try {
    return await fetchJson(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    }, 'Error al crear usuario')
  } catch (error) {
    if (isNetworkError(error)) {
      const users = readOfflineUsers()
      const existingUser = users.find((user) => user.email === userData.email)

      if (existingUser) {
        throw new Error('El correo ya está registrado')
      }

      const newUser = {
        id: users.length + 100,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role || 'user',
        password: userData.password || '',
      }

      const updatedUsers = [...users, newUser]
      saveOfflineUsers(updatedUsers)

      return { ok: true, data: normalizeUser(newUser) }
    }

    throw error
  }
}

export async function updateUser(id, userData) {
  try {
    return await fetchJson(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    }, 'Error al actualizar usuario')
  } catch (error) {
    if (isNetworkError(error)) {
      const users = readOfflineUsers()
      const index = users.findIndex((user) => user.id === Number(id))

      if (index === -1) {
        throw new Error('Usuario no encontrado')
      }

      const updatedUser = {
        ...users[index],
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role || users[index].role,
        password: userData.password !== undefined ? userData.password : users[index].password,
      }

      users[index] = updatedUser
      saveOfflineUsers(users)

      return { ok: true, data: normalizeUser(updatedUser) }
    }

    throw error
  }
}

export async function deleteUser(id) {
  try {
    await fetchJson(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }, 'Error al eliminar usuario')

    return true
  } catch (error) {
    if (isNetworkError(error)) {
      const users = readOfflineUsers()
      const updatedUsers = users.filter((user) => user.id !== Number(id))

      saveOfflineUsers(updatedUsers)
      return true
    }

    throw error
  }
}
