import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import RoomFormModal from '../../components/rooms/RoomFormModal'
import { createRoom, deleteRoom, getRooms, updateRoom } from '../../services/roomService'

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [filterActive, setFilterActive] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const loadRooms = async () => {
    try {
      setLoading(true)
      setRefreshing(true)
      const data = await getRooms()
      setRooms(data.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const openCreateModal = () => {
    setSelectedRoom(null)
    setShowModal(true)
  }

  const openEditModal = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRoom(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, formData)
        Swal.fire('Actualizado', 'Sala actualizada correctamente', 'success')
      } else {
        await createRoom(formData)
        Swal.fire('Creado', 'Sala creada correctamente', 'success')
      }
      closeModal()
      loadRooms()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: '¿Eliminar sala?',
      text: `Se eliminará la sala ${room.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire('Eliminado', 'Sala eliminada correctamente', 'success')
        loadRooms()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  const filteredRooms = rooms.filter((room) => {
    if (filterActive === 'active') return room.status
    if (filterActive === 'inactive') return !room.status
    return true
  })

  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h3 className="mb-1">Gestión de Salas</h3>
              <p className="text-secondary mb-0">Administra las salas disponibles para las clases.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-primary" onClick={loadRooms} disabled={refreshing}>
                {refreshing ? 'Refrescando...' : 'Refrescar'}
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nueva Sala
              </Button>
            </div>
          </div>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2 mb-0">Cargando salas...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <p className="text-center text-secondary">No hay salas registradas.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Capacidad</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.location || '—'}</td>
                    <td>
                      <Badge bg={room.status ? 'success' : 'secondary'}>
                        {room.status ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td>{formatDate(room.created_at)}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditModal(room)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(room)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <RoomFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedRoom={selectedRoom} />
    </>
  )
}

export default RoomsPage
