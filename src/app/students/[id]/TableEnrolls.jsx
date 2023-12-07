'use client'
import useSWR from 'swr'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingData from '@/components/LoadingData'
import ExportEnrollButton from '@/components/ExportEnrollButton'
import { formatDate } from '@/libs/utils/formatDate'

const columns = [
  { id: 'course', label: 'Nombre' },
  { id: 'note', label: 'Nota' },
  { id: 'finishedAt', label: 'Finalizado' },
  { id: 'emittedAt', label: 'Emitido' },
  { id: 'actions', label: 'Acciones' }
]

const TableEnrolls = ({ id, type = 'students' }) => {
  const { data: enrolls, error, isLoading } = useSWR(`/${type}/${id}/enrolls`)

  if (isLoading) return <LoadingData />

  if (error) return <Typography align='center'>Error al cargar matriculas</Typography>

  return (
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
                  : `${enroll.student.user.name} ${enroll.student.user.lastname}`}
              </TableCell>
              <TableCell>{enroll.note}</TableCell>
              <TableCell>{formatDate(enroll.finishedAt)}</TableCell>
              <TableCell>{formatDate(enroll.emittedAt)}</TableCell>
              <TableCell>
                <ExportEnrollButton id={enroll.id} />
                <Tooltip title='Editar'>
                  <IconButton aria-label='editar' size='small' color='warning'>
                    <EditIcon fontSize='inherit' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Eliminar'>
                  <IconButton aria-label='eliminar' size='small' color='error'>
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

export default TableEnrolls
