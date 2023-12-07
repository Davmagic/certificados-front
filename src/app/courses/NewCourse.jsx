'use client'
import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CustomDialog from '@/components/CustomDialog'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import { useSWRConfig } from 'swr'
import axiosInstance from '@/helpers/axiosInstance'

const NewCourse = () => {
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const toggleDialog = () => setOpen((prev) => !prev)

  return (
    <>
      <Button
        variant='contained'
        size='small'
        startIcon={<AddIcon />}
        onClick={toggleDialog}
      >
        Nuevo Curso
      </Button>
      <CustomDialog
        open={open}
        handleClose={toggleDialog}
        title='Nuevo Curso'
      >
        <Formik
          initialValues={{
            name: '',
            description: '',
            endAt: new Date(),
            hours: 0
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('El nombre es requerido'),
            description: Yup.string().required('La descripcion es requerida'),
            endAt: Yup.date().required('La fecha de finalizacion es requerida'),
            hours: Yup.number().min(0, 'no puede ser menor que 0').required('Las horas son requeridas')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axiosInstance.post('/courses', { ...values, endAt: new Date(values.endAt) })
              enqueueSnackbar('Curso creado correctamente', { variant: 'success' })
              mutate('/courses')
              toggleDialog()
            } catch (error) {
              console.log(error)
              enqueueSnackbar('Error al crear el curso', { variant: 'error' })
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
                label='Descripcion'
                name='description'
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                margin='normal'
              />
              <TextField
                fullWidth
                label='Fecha de finalizacion'
                name='endAt'
                type='date'
                value={values.endAt}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.endAt && errors.endAt)}
                helperText={touched.endAt && errors.endAt}
                margin='normal'
              />
              <TextField
                fullWidth
                label='Horas'
                name='hours'
                type='number'
                value={values.hours}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.hours && errors.hours)}
                helperText={touched.hours && errors.hours}
                margin='normal'
              />
              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='primary'
                disabled={isSubmitting}
              >
                Crear
              </Button>
            </form>
          )}
        </Formik>
      </CustomDialog>
    </>
  )
}

export default NewCourse
