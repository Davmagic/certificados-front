import React from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Autocomplete, Button, MenuItem, TextField } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import axiosInstance from '@/helpers/axiosInstance'

const FormCourse = ({ data }) => {
  const { mutate } = useSWRConfig()
  const { data: academies, isLoading } = useSWR('/academies')

  if (isLoading) return <div>Cargando...</div>

  return (
    <Formik
      initialValues={{
        name: data?.name || '',
        mode: data?.mode || '',
        bachelor: data?.bachelor || '',
        hours: data?.hours || 0,
        academyId: data?.academyId || ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('El nombre es requerido'),
        mode: Yup.string().required('La modalidad es requerida'),
        bachelor: Yup.string().required('El titulo del curso es requerido'),
        hours: Yup.number().min(0, 'no puede ser menor que 0').required('Las horas son requeridas'),
        academyId: Yup.string().required('La academia es requerida')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (data) {
            await axiosInstance.put(`/courses/${data.id}`, values)
            enqueueSnackbar('Curso actualizado', { variant: 'success' })
          } else {
            await axiosInstance.post('/courses', values)
            enqueueSnackbar('Curso creado', { variant: 'success' })
          }
          mutate('/courses')
        } catch (error) {
          console.log(error)
          enqueueSnackbar('Error al guardar el curso', { variant: 'error' })
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
            label='Modalidad'
            name='mode'
            value={values.mode}
            onChange={handleChange}
            onBlur={handleBlur}
            select
            error={Boolean(touched.mode && errors.mode)}
            helperText={touched.mode && errors.mode}
            margin='normal'
          >
            <MenuItem value='PRESENCIAL'>
              PRESENCIAL
            </MenuItem>
            <MenuItem value='VIRTUAL'>
              VIRTUAL
            </MenuItem>
            <MenuItem value='HIBRIDO'>
              HIBRIDO
            </MenuItem>
          </TextField>
          <TextField
            fullWidth
            label='Titulo'
            name='bachelor'
            value={values.bachelor}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.bachelor && errors.bachelor)}
            helperText={touched.bachelor && errors.bachelor}
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
          <Autocomplete
            fullWidth
            options={academies}
            getOptionLabel={(option) => option.name}
            value={values.academyId ? academies.find(academy => academy.id === values.academyId) : null}
            onChange={(e, value) => {
              handleChange({
                target: {
                  name: 'academyId',
                  value: value.id
                }
              })
            }}
            isOptionEqualToValue={(option, _) => option.id === values.academyId}
            onBlur={handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Academia'
                variant='outlined'
                error={Boolean(touched.academyId && errors.academyId)}
                helperText={touched.academyId && errors.academyId}
                margin='normal'
              />
            )}
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

export default FormCourse
