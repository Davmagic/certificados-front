'use client'

import useSWR, { useSWRConfig } from 'swr'
import Link from 'next/link'
import LoadingData from '@/components/LoadingData'
import { Button, DialogContentText, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import { useState } from 'react'
import CustomDialog from '@/components/CustomDialog'
import axiosInstance from '@/helpers/axiosInstance'
import { enqueueSnackbar } from 'notistack'
import NewCourse from './NewCourse'

const columns = [
  {
    field: 'name',
    headerName: 'Nombre'
  },
  {
    field: 'mode',
    headerName: 'Modalidad',
    width: 150
  },
  {
    field: 'hours',
    headerName: 'Horas'
  },
  {
    field: 'academy',
    headerName: 'Academia'
  },
  {
    field: 'students',
    headerName: '# de Estudiantes'
  },
  {
    field: 'actions',
    headerName: 'Acciones'
  }
]

const TableCourses = () => {
  const { mutate } = useSWRConfig()
  const { data: courses, error, isLoading } = useSWR('/courses')
  const [open, setOpen] = useState(false)
  const [selCourse, setSelCourse] = useState(null)

  const toggleConfirm = (item) => {
    setSelCourse(item || null)
    setOpen(prev => !prev)
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/courses/${selCourse.id}`)
      toggleConfirm('/courses')
      mutate()
      enqueueSnackbar('Curso eliminado', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Error al eliminar el curso', { variant: 'error' })
    }
  }

  if (isLoading) return <LoadingData />

  if (error) return <div>Error al cargar los cursos</div>

  return (
    <>
      <CustomDialog
        open={open}
        title='Eliminar curso'
        handleClose={() => toggleConfirm()}
        actions={
          <>
            <Button onClick={() => toggleConfirm()}>Cancelar</Button>
            <Button onClick={handleDelete}>Eliminar</Button>
          </>
        }
      >
        <DialogContentText>
          se eliminará toda la información relacionada ¿Esta seguro que desea eliminar este curso?{'\n'}
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
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.mode}</TableCell>
                <TableCell>{course.hours}</TableCell>
                <TableCell>{course.academy?.name}</TableCell>
                <TableCell>{course._count.enrolls}</TableCell>
                <TableCell>
                  <Tooltip title='Certificados'>
                    <Link href={`/courses/${course.id}`} passHref>
                      <IconButton color='success'>
                        <BookmarkAddIcon fontSize='inherit' />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  <NewCourse data={course} />
                  <Tooltip title='Eliminar'>
                    <IconButton color='error' onClick={() => toggleConfirm(course)}>
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

export default TableCourses
