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
              <Typography gutterBottom>C.I.: <strong>{student?.user.dni}</strong></Typography>
              <Typography gutterBottom>Nombre: <strong>{student?.user.name}</strong></Typography>
              <Typography gutterBottom>Apellidos: <strong>{student?.user.lastname}</strong></Typography>
              <Typography gutterBottom># de matriculas: <strong>{student?._count.enrolls}</strong></Typography>
            </CardContent>
          </>
          )}
    </Card>
  )
}

export default StudentCard
