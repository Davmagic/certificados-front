'use client'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
// import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingData from '@/components/LoadingData'
import ExportEnrollButton from '@/components/ExportEnrollButton'
import { formatDate } from '@/libs/utils/formatDate'
import QrCodeButton from '@/components/QrCodeButton'
import CustomDialog from '@/components/CustomDialog'
import axiosInstance from '@/helpers/axiosInstance'
import { enqueueSnackbar } from 'notistack'

const columns = [
  { id: 'course', label: 'Nombre' },
  { id: 'emittedAt', label: 'Emitido' },
  { id: 'actions', label: 'Acciones' }
]

const TableEnrolls = ({ id, type = 'students' }) => {
  const { mutate } = useSWRConfig()
  const { data: enrolls, error, isLoading } = useSWR(`/${type}/${id}/enrolls`)
  const [open, setOpen] = useState(false)
  const [enroll, setEnroll] = useState(null)

  const handleToggle = () => setOpen(prev => !prev)

  const handleConfirm = (data) => {
    setEnroll(data)
    handleToggle()
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/enrolls/${enroll.id}`)
      handleToggle()
      mutate(`/${type}/${id}/enrolls`)
      enqueueSnackbar('Certificado eliminado', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Error al eliminar el certificado', { variant: 'error' })
    }
  }

  if (isLoading) return <LoadingData />

  if (error) return <Typography align='center'>Error al cargar certificados</Typography>

  return (
    <>
      <CustomDialog
        open={open}
        handleClose={handleToggle}
        title='Eliminar estudiante'
        actions={
          <>
            <Button onClick={handleToggle}>Cancelar</Button>
            <Button variant='contained' color='error' onClick={handleDelete}>
              Eliminar
            </Button>
          </>
        }
      >
        <Typography gutterBottom>
          ¿Está seguro de eliminar el certificado?
        </Typography>
        <Typography gutterBottom>
          recuerde que esta acción no se puede deshacer
        </Typography>
      </CustomDialog>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enrolls?.map((enroll) => (
              <TableRow key={enroll.id}>
                <TableCell>
                  {type === 'students'
                    ? enroll.course.name
                    : `${enroll.student.name} ${enroll.student.lastname}`}
                </TableCell>
                <TableCell>{formatDate(enroll.emittedAt)}</TableCell>
                <TableCell>
                  <QrCodeButton enroll={enroll} />
                  <ExportEnrollButton id={enroll.id} />
                  {/* <Tooltip title='Editar'>
                    <IconButton aria-label='editar' size='small' color='warning'>
                      <EditIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip> */}
                  <Tooltip title='Eliminar'>
                    <IconButton aria-label='eliminar' size='small' color='error' onClick={() => handleConfirm(enroll)}>
                      <DeleteIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default TableEnrolls
