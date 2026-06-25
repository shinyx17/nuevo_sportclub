import { useEffect, useState } from 'react'
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import UserFormModal from '../../components/users/UserFormModal'
import { createUser, deleteUser, getUsers, updateUser } from '../../services/userService'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
      } else {
        await createUser(formData)
        Swal.fire('Creado', 'Usuario creado correctamente', 'success')
      }
      closeModal()
      loadUsers()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${user.full_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
        loadUsers()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Gestión de Usuarios</h3>
          <Button variant="primary" onClick={openCreateModal}>
            Nuevo Usuario
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2 mb-0">Cargando usuarios...</p>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'coach' ? 'warning' : 'secondary'}>
                      {user.role === 'admin'
                        ? 'Administrador'
                        : user.role === 'coach'
                          ? 'Entrenador'
                          : 'Usuario'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditModal(user)}>
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </Card>
  )
}

export default UsersPage
