'use client'
import { useState } from 'react'
import { Formik } from 'formik'
import useSWR, { useSWRConfig } from 'swr'
import * as Yup from 'yup'
import { Autocomplete, Button, Grid, TextField } from '@mui/material'
import CustomDialog from '@/components/CustomDialog'
import axiosInstance from '@/helpers/axiosInstance'
import { enqueueSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'
import moment from 'moment'

const NewEnroll = ({ id, bachelor = '' }) => {
  const { mutate } = useSWRConfig()
  const { data: students, isLoading } = useSWR('/students')
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(prev => !prev)

  if (isLoading) return null

  return (
    <>
      <Button variant='contained' onClick={toggleOpen} size='small' startIcon={<AddIcon />}>
        Registrar certificado
      </Button>
      <CustomDialog
        open={open}
        handleClose={toggleOpen}
        title='Registrar certificado'
      >
        <Formik
          initialValues={{
            courseId: id,
            studentId: '',
            emittedAt: new Date(),
            bachelor
          }}
          validationSchema={Yup.object().shape({
            studentId: Yup.string().required('El estudiante es requerido'),
            emittedAt: Yup.date().required('La fecha de emisión es requerida'),
            bachelor: Yup.string().notRequired()
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true)
              const enroll = [{
                courseId: values.courseId,
                emittedAt: moment(values.emittedAt).add(5, 'hours').toDate(),
                bachelor: values.bachelor
              }]
              await axiosInstance.post(`/students/${values.studentId}/enroll`, { enrolls: enroll })
              enqueueSnackbar('Registro exitoso', { variant: 'success' })
              mutate(`/courses/${id}/enrolls`)
              toggleOpen()
            } catch (error) {
              console.log(error)
              enqueueSnackbar('Error al registrar al estudiante', { variant: 'error' })
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    options={students}
                    value={values.studentId ? students.find(student => student.id === values.studentId) : null}
                    getOptionLabel={option => `${option.partner} - ${option.name} ${option.lastname}`}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Estudiante'
                        variant='outlined'
                        error={Boolean(touched.id && errors.id)}
                        helperText={touched.id && errors.id}
                      />
                    )}
                    onChange={(e, value) => handleChange({ target: { name: 'studentId', value: value?.id } })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    label='Fecha de emisión'
                    name='emittedAt'
                    type='date'
                    value={values.emittedAt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.emittedAt && errors.emittedAt)}
                    helperText={touched.emittedAt && errors.emittedAt}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    label='Título'
                    name='bachelor'
                    value={values.bachelor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.bachelor && errors.bachelor)}
                    helperText={touched.bachelor && errors.bachelor}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting}
                  >
                    guardar
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </CustomDialog>
    </>
  )
}

export default NewEnroll
