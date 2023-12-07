import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import MediaCard from '@/components/MediaCard'

export default function HomePage () {
  return (
    <Box>
      <Alert severity='info' sx={{ mt: 2, mb: 5 }}>
        <AlertTitle>Bienvenid@ 👋</AlertTitle>
        ¿Qué quieres ver hoy?
      </Alert>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid xs={6}>
          <MediaCard
            heading='Iniciar sesión'
            text='Para poder acceder a las funcionalidades de la plataforma.'
            href='/api/auth/signin'
          />
        </Grid>
        <Grid xs={6}>
          <MediaCard
            heading='Estudiantes'
            text='Administra los estudiantes que están matriculados o agrega más.'
            href='/students'
          />
        </Grid>
        <Grid xs={6}>
          <MediaCard
            heading='Cursos'
            text='Administra los cursos que existen o agrega más.'
            href='/courses'
          />
        </Grid>
        {/* <Grid xs={6}>
          <MediaCard
            heading='CIELAB'
            text='The CIELAB color space, also referred to as L*a*b*, was intended as a perceptually uniform space, where a given numerical change corresponds to a similar perceived change in color.'
          />
        </Grid> */}
      </Grid>
    </Box>
  )
}
