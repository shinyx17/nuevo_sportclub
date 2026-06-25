const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-1-eevt.onrender.com'
const API_URL = `${BASE_URL}/api/users`
const OFFLINE_USERS_KEY = 'offlineUsers'

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
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

export async function getUsers() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Error al obtener usuarios')
    }

    return response.json()
  } catch (error) {
    const offlineUsers = readOfflineUsers().map(normalizeUser)
    return { ok: true, data: offlineUsers }
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario')
    }

    return data
  } catch (error) {
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
}

export async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario')
    }

    return data
  } catch (error) {
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
}

export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Error al eliminar usuario')
    }

    return true
  } catch (error) {
    const users = readOfflineUsers()
    const updatedUsers = users.filter((user) => user.id !== Number(id))

    saveOfflineUsers(updatedUsers)
    return true
  }
}
