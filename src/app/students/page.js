'use client'
import { useState } from 'react'
import { CircularProgress, Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, IconButton, Tooltip, Card, CardHeader, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import EditIcon from '@mui/icons-material/Edit'
import axios from '@/helpers/axiosInstance'
import CustomDialog from '@/components/CustomDialog'
import StudentForm from './StudentForm'
import Link from 'next/link'
import useSWR, { useSWRConfig } from 'swr'

export const metedata = {
  title: 'Estudiantes',
  description: 'Lista de estudiantes'
}

const StudentsPage = () => {
  const { mutate } = useSWRConfig()
  const { data: students, isLoading } = useSWR('/students')
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleOpen = (student) => {
    setSelectedStudent(student)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedStudent(null)
    setOpen(false)
  }

  const handleOpenConfirm = (student) => {
    setSelectedStudent(student)
    setOpenConfirm(true)
  }

  const handleCloseConfirm = () => {
    setSelectedStudent(null)
    setOpenConfirm(false)
  }

  const handleConfirm = async () => {
    try {
      await axios.delete(`/users/${selectedStudent.userId}`)
      handleCloseConfirm()
      mutate('/students')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Card sx={{ mb: 2 }} elevation={3}>
        <CardHeader
          title='Lista de estudiantes' component='h4'
          action={
            <Button
              variant='outlined'
              size='small'
              color='primary'
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Nuevo estudiante
            </Button>
          }
        />
      </Card>
      <CustomDialog
        open={open}
        handleClose={() => handleClose()}
        title={selectedStudent ? 'Editar estudiante' : 'Nuevo estudiante'}
      >
        <StudentForm student={selectedStudent} handleClose={handleClose} />
      </CustomDialog>
      <CustomDialog
        open={openConfirm}
        handleClose={() => handleCloseConfirm()}
        title='Eliminar estudiante'
        actions={
          <>
            <Button onClick={() => handleCloseConfirm()}>Cancelar</Button>
            <Button variant='contained' color='error' onClick={() => handleConfirm()}>
              Eliminar
            </Button>
          </>
        }
      >
        <Typography gutterBottom>
          ¿Está seguro de eliminar el estudiante y toda la información relacionada?
        </Typography>
        <Typography gutterBottom>
          recuerde que esta acción no se puede deshacer
        </Typography>
      </CustomDialog>
      {isLoading
        ? (
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='info' />
          </Box>
          )
        : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>C.I.</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Número de matrículas</TableCell>
                  {/* <TableCell>Estado</TableCell> */}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students?.map((student) => (
                  <TableRow
                    key={student.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {student.user.dni}
                    </TableCell>
                    <TableCell>{student.user.name}</TableCell>
                    <TableCell>{student.user.lastname}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student._count.enrolls}</TableCell>
                    {/* <TableCell>
                      <Chip
                        label={student.user.isActive ? 'activo' : 'inactivo'}
                        color={student.user.isActive ? 'succes' : 'error'}
                        variant='outlined'
                      />
                    </TableCell> */}
                    <TableCell>
                      <Tooltip title='Matricular'>
                        <Link href={`/students/${student.id}`} passHref>
                          <IconButton color='success'>
                            <BookmarkAddIcon fontSize='inherit' />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title='Editar'>
                        <IconButton color='warning' onClick={() => handleOpen(student)}>
                          <EditIcon fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Eliminar'>
                        <IconButton color='error' onClick={() => handleOpenConfirm(student)}>
                          <DeleteIcon fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
    </div>
  )
}

export default StudentsPage
