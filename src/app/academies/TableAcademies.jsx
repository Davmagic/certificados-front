'use client'

import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { enqueueSnackbar } from 'notistack'
// import Link from 'next/link'
import { Button, DialogContentText, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
// import InfoIcon from '@mui/icons-material/Info'
import LoadingData from '@/components/LoadingData'
import CustomDialog from '@/components/CustomDialog'
import axiosInstance from '@/helpers/axiosInstance'
import NewAcademy from './NewAcademy'

const columns = [
  {
    field: 'name',
    headerName: 'Nombre'
  },
  {
    field: 'description',
    headerName: 'Descripción'
  },
  {
    field: 'courses',
    headerName: '# de Cursos'
  },
  {
    field: 'actions',
    headerName: 'Acciones'
  }
]

const TableAcademies = () => {
  const { mutate } = useSWRConfig()
  const { data: academies, error, isLoading } = useSWR('/academies')
  const [open, setOpen] = useState(false)
  const [selAcademy, setSelAcademy] = useState(null)

  const toggleConfirm = (item) => {
    setSelAcademy(item || null)
    setOpen(prev => !prev)
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/academies/${selAcademy.id}`)
      toggleConfirm()
      mutate('/academies')
      enqueueSnackbar('Academia eliminada', { variant: 'success' })
    } catch (error) {
      if (error.response?.status === 400) {
        enqueueSnackbar('No se puede borrar una academia con cursos registrados', { variant: 'error' })
      } else {
        enqueueSnackbar('Error al eliminar el academia', { variant: 'error' })
      }
      console.log(error.toJSON())
    }
  }

  if (isLoading) return <LoadingData />

  if (error) return <div>Error al cargar las academias</div>

  return (
    <>
      <CustomDialog
        open={open}
        title='Eliminar academia'
        handleClose={() => toggleConfirm()}
        actions={
          <>
            <Button onClick={() => toggleConfirm()}>Cancelar</Button>
            <Button variant='contained' color='error' onClick={handleDelete}>Eliminar</Button>
          </>
        }
      >
        <DialogContentText gutterBottom>
          ¿Esta seguro que desea eliminar este academia?
        </DialogContentText>
        <DialogContentText gutterBottom>
          No se puede eliminar una academia con cursos registrados. Primero elimine los cursos y vuelva a intentarlo
        </DialogContentText>
        <DialogContentText>
          Esta accion no se puede deshacer.
        </DialogContentText>
      </CustomDialog>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size='small'>
          <TableHead>
            <TableRow>
              {columns.map(({ field, headerName }) => (
                <TableCell key={field}>{headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {academies?.map((academy) => (
              <TableRow key={academy.id}>
                <TableCell>{academy.name}</TableCell>
                <TableCell>{academy.description}</TableCell>
                <TableCell>{academy._count.courses}</TableCell>
                <TableCell>
                  {/* <Tooltip title='Detalles'>
                    <Link href={`/academies/${academy.id}`} passHref>
                      <IconButton color='info'>
                        <InfoIcon fontSize='inherit' />
                      </IconButton>
                    </Link>
                  </Tooltip> */}
                  <NewAcademy data={academy} />
                  <Tooltip title='Eliminar'>
                    <IconButton color='error' onClick={() => toggleConfirm(academy)}>
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

export default TableAcademies
