import { useSWRConfig } from 'swr'
import { Button, TextField } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import axiosInstance from '@/helpers/axiosInstance'

const FormAcademy = ({ data }) => {
  const { mutate } = useSWRConfig()

  return (
    <Formik
      initialValues={{
        name: data?.name || '',
        description: data?.description || ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('El nombre es requerido'),
        description: Yup.string().notRequired()
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (data) {
            await axiosInstance.put(`/academies/${data.id}`, values)
            enqueueSnackbar('Academia actualizada', { variant: 'success' })
          } else {
            await axiosInstance.post('/academies', values)
            enqueueSnackbar('Academia creada', { variant: 'success' })
          }
          mutate('/academies')
        } catch (error) {
          enqueueSnackbar('Error al guardar la Academia, Verificar si ya existe la academia', { variant: 'error' })
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
            label='Nombre'
            name='name'
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            margin='normal'
          />
          <TextField
            fullWidth
            label='Descripción'
            name='description'
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            margin='normal'
          />
          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            disabled={isSubmitting}
          >
            {data ? 'Actualizar' : 'Guardar'}
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default FormAcademy
