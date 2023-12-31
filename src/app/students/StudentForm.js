'use client'
import axiosInstance from '@/helpers/axiosInstance'
import { Button, TextField } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { useSWRConfig } from 'swr'

const StudentForm = ({ student, handleClose }) => {
  const { mutate } = useSWRConfig()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        dni: student?.dni || '',
        partner: student?.partner || '',
        name: student?.name || '',
        lastname: student?.lastname || ''
      }}
      validationSchema={Yup.object().shape({
        dni: Yup.string().max(255).required('C.I. es requerido')
          .test('uniquedni', 'Cédula ya existe', async (value) => {
            try {
              if (student?.dni === value) {
                return true
              }
              const response = await axiosInstance.get(`/students/search?dni=${value}`)
              const { data } = response
              if (data) {
                return false
              }
              return true
            } catch (error) {
              console.error(error)
              return false
            }
          }),
        partner: Yup.string().max(100).required('Código de socio es requerido'),
        name: Yup.string().max(100).required('Nombre es requerido'),
        lastname: Yup.string().max(100).required('Apellido es requerido')
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          setSubmitting(true)
          if (student) {
            await axiosInstance.put(`/students/${student.id}`, values)
            enqueueSnackbar('Estudiante actualizado', { variant: 'success' })
          } else {
            await axiosInstance.post('/students', values)
            enqueueSnackbar('Estudiante creado', { variant: 'success' })
          }
          mutate('/students')
          handleClose?.()
        } catch (error) {
          console.error(error)
          enqueueSnackbar('Error al crear, verifique que la cedula no se repite', { variant: 'error' })
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin='normal'
            label='C.I.'
            name='dni'
            variant='outlined'
            value={values.dni}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.dni && errors.dni)}
            helperText={touched.dni && errors.dni}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Nombre'
            name='name'
            variant='outlined'
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Apellido'
            name='lastname'
            variant='outlined'
            value={values.lastname}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.lastname && errors.lastname)}
            helperText={touched.lastname && errors.lastname}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Código de socio'
            name='partner'
            variant='outlined'
            value={values.partner}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.partner && errors.partner)}
            helperText={touched.partner && errors.partner}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default StudentForm
