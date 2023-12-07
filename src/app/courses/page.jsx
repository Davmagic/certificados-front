import { Box, Card, CardHeader } from '@mui/material'
import NewCourse from './NewCourse'
import TableCourses from './TableCourses'

export default function CoursesPage () {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title='Cursos'
          action={<NewCourse />}
        />
      </Card>
      <TableCourses />
    </Box>
  )
}
