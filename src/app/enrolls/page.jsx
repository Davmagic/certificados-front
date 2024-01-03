'use client'
import { Box, Button, Card, CardContent, CardHeader, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'
import axiosInstance from '@/helpers/axiosInstance'
import { enqueueSnackbar } from 'notistack'
import { formatDate } from '@/libs/utils/formatDate'
import { useSearchParams } from 'next/navigation'

export default function EnrollsPage () {
  const searchParams = useSearchParams()
  const searchDni = searchParams.get('dni') || ''
  const searchLastname = searchParams.get('lastname') || ''
  const [lastname, setLastname] = useState(searchLastname)
  const [dni, setDni] = useState(searchDni)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = {}
      if (lastname) {
        params.lastname = lastname
      } else if (dni) {
        params.dni = dni
      } else {
        enqueueSnackbar('Debe ingresar al menos un criterio de búsqueda', { variant: 'warning' })
        setLoading(false)
        return
      }
      const { data } = await axiosInstance.get('/enrolls/search', { params })
      setResults(data)
      setDni('')
      setLastname('')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar('Error al realizar la búsqueda, Inténtelo de nuevo más tarde', { variant: 'error' })
    }
  }

  useEffect(() => {
    if (searchDni || searchLastname) {
      handleSearch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ minHeight: '15rem', marginBottom: 3 }}>
        <CardContent
          component={Grid}
          container
          spacing={2}
          alignItems='center'
          justifyContent='center'
        >
          <Grid item xs={12}>
            <Typography gutterBottom align='center'>
              Aquí puedes realizar la busqueda de certificados por apellidos o número de cédula.
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              label='Buscar por apellidos:'
              name='lastname'
              variant='outlined'
              value={lastname}
              onChange={e => setLastname(e.target.value)}
            />
            <br />
            <p>-- o --</p>
            <TextField
              fullWidth
              label='Buscar por número de Cédula:'
              name='dni'
              variant='outlined'
              value={dni}
              onChange={e => setDni(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              color='secondary'
              fullWidth
              type='submit'
              variant='contained'
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              Buscar
            </Button>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Resultados' />
        <CardContent>
          {loading && <Typography align='center'>Cargando...</Typography>}
          {!loading && results.length === 0 && <Typography align='center'>No se encontraron resultados</Typography>}
          {!loading && results.length > 0
            ? (
              <TableContainer sx={{ maxHeight: '50vh' }} component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Apellidos</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Cédula</TableCell>
                      <TableCell>Curso</TableCell>
                      <TableCell>Modalidad</TableCell>
                      <TableCell>Emisión del Certificado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map(({ student, course, ...result }) => (
                      <TableRow key={result.id}>
                        <TableCell>{student.lastname}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.dni}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.mode}</TableCell>
                        <TableCell>{formatDate(result.emittedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              )
            : null}
        </CardContent>
      </Card>
    </Box>
  )
}
