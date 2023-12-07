'use client'

import useSWR from 'swr'
import Link from 'next/link'
import LoadingData from '@/components/LoadingData'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'

const columns = [
  {
    field: 'name',
    headerName: 'Nombre'
  },
  {
    field: 'description',
    headerName: 'Descripcion',
    width: 150
  },
  {
    field: 'endAt',
    headerName: 'Fecha de finalizacion'
  },
  {
    field: 'hours',
    headerName: 'Horas'
  },
  {
    field: 'students',
    headerName: 'Estudiantes'
  },
  {
    field: 'actions',
    headerName: 'Acciones'
  }
]

const TableCourses = () => {
  const { data: courses, error, isLoading } = useSWR('/courses')

  if (isLoading) return <LoadingData />

  if (error) return <div>Error al cargar los cursos</div>

  return (
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
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.endAt}</TableCell>
              <TableCell>{course.hours}</TableCell>
              <TableCell>{course._count.enrolls}</TableCell>
              <TableCell>
                <Tooltip title='Matricular'>
                  <Link href={`/courses/${course.id}`} passHref>
                    <IconButton color='success'>
                      <BookmarkAddIcon fontSize='inherit' />
                    </IconButton>
                  </Link>
                </Tooltip>
                <Tooltip title='Eliminar'>
                  <IconButton color='error'>
                    <DeleteIcon fontSize='inherit' />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCourses
