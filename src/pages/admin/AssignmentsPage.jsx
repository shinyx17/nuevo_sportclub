import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import SportRoomFormModal from '../../components/sportRooms/SportRoomFormModal'
import { createAssignment, deleteAssignment, getAssignments, updateAssignment } from '../../services/sportRoomService'
import { getRooms } from '../../services/roomService'
import { getSports } from '../../services/sportsService'
import { getUsers } from '../../services/userService'

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [rooms, setRooms] = useState([])
  const [sports, setSports] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadAssignments = async () => {
    try {
      setLoading(true)
      setRefreshing(true)
      const [assignmentResult, roomsResult, sportsResult, usersResult] = await Promise.all([
        getAssignments(),
        getRooms(),
        getSports(),
        getUsers(),
      ])

      setAssignments(assignmentResult.data || [])
      setRooms(roomsResult.data || [])
      setSports(sportsResult.data || [])
      setCoaches((usersResult.data || []).filter((user) => user.role === 'coach'))
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  const openCreateModal = () => {
    setSelectedAssignment(null)
    setShowModal(true)
  }

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAssignment(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedAssignment) {
        await updateAssignment(selectedAssignment.id, formData)
        Swal.fire('Actualizado', 'Asignación actualizada correctamente', 'success')
      } else {
        await createAssignment(formData)
        Swal.fire('Creado', 'Asignación creada correctamente', 'success')
      }
      closeModal()
      loadAssignments()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (assignment) => {
    const result = await Swal.fire({
      title: '¿Eliminar asignación?',
      text: `Se eliminará la asignación de ${assignment.sport?.name || 'deporte'} en ${assignment.room?.name || 'sala'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteAssignment(assignment.id)
        Swal.fire('Eliminado', 'Asignación eliminada correctamente', 'success')
        loadAssignments()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  const statusBadge = useMemo(
    () => ({
      true: { text: 'Activo', variant: 'success' },
      false: { text: 'Inactivo', variant: 'secondary' },
    }),
    [],
  )

  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h3 className="mb-1">Gestión de Asignaciones</h3>
              <p className="text-secondary mb-0">Administra qué coach da qué deporte en qué sala.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-primary" onClick={loadAssignments} disabled={refreshing}>
                {refreshing ? 'Refrescando...' : 'Refrescar'}
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nueva Asignación
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2 mb-0">Cargando asignaciones...</p>
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-center text-secondary">No hay asignaciones registradas.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deporte</th>
                  <th>Sala</th>
                  <th>Coach</th>
                  <th>Observación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{assignment.sport?.name || '—'}</td>
                    <td>{assignment.room?.name || '—'}</td>
                    <td>{assignment.coach?.full_name || assignment.coach?.email || '—'}</td>
                    <td>{assignment.observation || '—'}</td>
                    <td>
                      <Badge bg={statusBadge[Boolean(assignment.status)].variant}>
                        {statusBadge[Boolean(assignment.status)].text}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button variant="outline-secondary" size="sm" onClick={() => openEditModal(assignment)}>
                          Editar
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(assignment)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <SportRoomFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedAssignment={selectedAssignment}
        sports={sports}
        rooms={rooms}
        coaches={coaches}
      />
    </>
  )
}

export default AssignmentsPage
