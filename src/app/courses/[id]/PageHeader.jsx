'use client'
import LoadingData from '@/components/LoadingData'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import useSWR from 'swr'
import NewEnroll from './NewEnroll'

const PageHeader = ({ id }) => {
  const { data: course, error, isLoading } = useSWR(`/courses/${id}`)

  if (isLoading) return <LoadingData />

  if (error) return <div>Error al cargar los datos del curso</div>

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title='Detalles del curso'
        action={<NewEnroll id={id} bachelor={course.bachelor} />}
      />
      <CardContent>
        <Typography gutterBottom>
          <strong>Nombre: </strong>
          {course.name}
        </Typography>
        <Typography gutterBottom>
          <strong>Modalidad: </strong>
          {course.mode}
        </Typography>
        <Typography gutterBottom>
          <strong>Academia: </strong>
          {course.academy?.name}
        </Typography>
        <Typography gutterBottom>
          <strong># de Horas: </strong>
          {course.hours}
        </Typography>
        <Typography gutterBottom>
          <strong>Título al finalizar: </strong>
          {course.bachelor}
        </Typography>
        <Typography gutterBottom>
          <strong>Total de estudiantes: </strong>
          {course._count.enrolls}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default PageHeader
