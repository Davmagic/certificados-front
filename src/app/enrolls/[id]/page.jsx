/* eslint-disable @next/next/no-img-element */
'use client'
import useSWR from 'swr'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import WorkIcon from '@mui/icons-material/Work'
import HistoryIcon from '@mui/icons-material/History'
import LoadingData from '@/components/LoadingData'
import { QR_BASE } from '@/libs/utils/createPDF'
import QRCode from 'react-qr-code'
import { formatDate } from '@/libs/utils/formatDate'

const EnrollDetail = ({ params: { id } }) => {
  const { data: enroll, error, isLoading } = useSWR(`/enrolls/${id}`)

  if (isLoading) return <LoadingData />

  if (error) return <div>Error al cargar los datos del certificado</div>

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} className='flex flex-row gap-2'>
            <PersonIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {enroll.student.name} {enroll.student.lastname}
              </Typography>
              <Typography component='span' variant='caption'>
                Nombres y Apellidos
              </Typography>
            </div>
            <Divider variant='middle' role='presentation' />
          </Grid>
          <Grid item xs={12} className='flex flex-row gap-2'>
            <RecentActorsIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {enroll.student.dni}
              </Typography>
              <Typography component='span' variant='caption'>
                Documento de indentidad
              </Typography>
            </div>
            <Divider variant='middle' />
          </Grid>
          <Grid item xs={12} className='flex flex-row gap-2'>
            <EventAvailableIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {formatDate(enroll.emittedAt)}
              </Typography>
              <Typography component='span' variant='caption'>
                Fecha de emisión
              </Typography>
            </div>
            <Divider variant='middle' />
          </Grid>
          <Grid item xs={12} sm={6} className='flex flex-row gap-2'>
            <AccountBalanceIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {enroll.course.academy.name}
              </Typography>
              <Typography component='span' variant='caption'>
                Organismo capacitador
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className='flex flex-row gap-2'>
            <WorkIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {enroll.course.bachelor}
              </Typography>
              <Typography component='span' variant='caption'>
                Título
              </Typography>
            </div>
            <Divider variant='middle' />
          </Grid>
          <Grid item xs={12} sm={6} className='flex flex-row gap-2'>
            <HistoryIcon fontSize='large' />
            <div>
              <Typography gutterBottom>
                {enroll.course.hours}
              </Typography>
              <Typography component='span' variant='caption'>
                Duración/horas
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <img src='/centro-logo.png' alt='logo' width='80' height='80' className='me-1' />
          </Grid>
          <Grid item xs={12}>
            <Divider variant='middle' sx={{ marginBottom: 5 }} />
            <QRCode value={`${QR_BASE}/${id}`} level='L' size={150} className='p-2 bg-white mb-5' />
            <Typography component='span' variant='caption'>
              Superintendencia de compañias
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EnrollDetail
