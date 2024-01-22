import { Box, Card, CardHeader } from '@mui/material'
import NewAcademy from './NewAcademy'
import TableAcademies from './TableAcademies'

export default function DashboardPage () {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title='Academias'
          action={<NewAcademy />}
        />
      </Card>
      <TableAcademies />
    </Box>
  )
}
