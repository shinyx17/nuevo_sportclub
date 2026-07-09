import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Row, Spinner, Table, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import SportFormModal from '../../components/sports/SportFormModal'
import { createSport, deleteSport, getSports, toggleSportStatus, updateSport } from '../../services/sportsService'

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('es-CL', options)
}

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadSports = async () => {
    try {
      setLoading(true)
      const data = await getSports()
      setSports(data.data || [])
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadSports()
  }, [])

  const openCreateModal = () => {
    setSelectedSport(null)
    setShowModal(true)
  }

  const openEditModal = (sport) => {
    setSelectedSport(sport)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSport(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire('Actualizado', 'Deporte actualizado correctamente', 'success')
      } else {
        await createSport(formData)
        Swal.fire('Creado', 'Deporte creado correctamente', 'success')
      }
      closeModal()
      loadSports()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: '¿Está seguro de eliminar este deporte?',
      text: `Se eliminará el deporte ${sport.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id)
        Swal.fire('Eliminado', 'Deporte eliminado correctamente', 'success')
        loadSports()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  const handleStatusToggle = async (sport) => {
    try {
      const updated = await toggleSportStatus(sport.id, !sport.status)
      setSports((current) =>
        current.map((item) => (item.id === sport.id ? updated.data : item)),
      )
      Swal.fire('Actualizado', 'Estado del deporte actualizado correctamente', 'success')
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
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
              <h3 className="mb-1">Gestión de Deportes</h3>
              <p className="text-secondary mb-0">Administra los deportes disponibles, su estado, duración y objetivo.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-primary" onClick={loadSports} disabled={refreshing}>
                {refreshing ? 'Refrescando...' : 'Refrescar'}
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nuevo Deporte
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2 mb-0">Cargando deportes...</p>
            </div>
          ) : sports.length === 0 ? (
            <p className="text-center text-secondary">No hay deportes registrados.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sports.map((sport) => (
                  <tr key={sport.id}>
                    <td>{sport.id}</td>
                    <td>{sport.name}</td>
                    <td>{sport.objective}</td>
                    <td>{sport.duration} min</td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <Form.Check
                          type="switch"
                          id={`status-switch-${sport.id}`}
                          checked={Boolean(sport.status)}
                          onChange={() => handleStatusToggle(sport)}
                        />
                        <Badge bg={statusBadge[Boolean(sport.status)].variant}>
                          {statusBadge[Boolean(sport.status)].text}
                        </Badge>
                      </div>
                    </td>
                    <td>{formatDate(sport.created_at)}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => openEditModal(sport)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sport)}>
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

      <SportFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSport={selectedSport}
      />
    </>
  )
}

export default SportsPage
