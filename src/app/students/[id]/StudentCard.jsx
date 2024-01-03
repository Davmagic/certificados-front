'use client'
import NewEnroll from './NewEnroll'
import { Card, CardContent, CardHeader, Skeleton, Typography } from '@mui/material'
import useSWR from 'swr'

const StudentCard = ({ id }) => {
  const { data: student, isLoading } = useSWR(`/students/${id}`)

  return (
    <Card sx={{ mb: 2 }} elevation={3}>
      {isLoading
        ? (
          <Skeleton variant='rectangular' width='100%' />
          )
        : (
          <>
            <CardHeader
              title='Detalle del estudiante' component='h4'
              action={<NewEnroll id={id} />}
            />
            <CardContent>
              <Typography gutterBottom>C.I.: <strong>{student?.dni}</strong></Typography>
              <Typography gutterBottom>Nombre: <strong>{student?.name}</strong></Typography>
              <Typography gutterBottom>Apellidos: <strong>{student?.lastname}</strong></Typography>
              <Typography gutterBottom>Código de socio: <strong>{student?.partner}</strong></Typography>
              <Typography gutterBottom># de Certificados: <strong>{student?._count.enrolls}</strong></Typography>
            </CardContent>
          </>
          )}
    </Card>
  )
}

export default StudentCard
