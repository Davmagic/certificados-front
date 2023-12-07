'use client'
import { useState } from 'react'
import { Formik } from 'formik'
import useSWR, { useSWRConfig } from 'swr'
import * as Yup from 'yup'
import { Button, Grid, MenuItem, TextField } from '@mui/material'
import CustomDialog from '@/components/CustomDialog'
import axiosInstance from '@/helpers/axiosInstance'
import { enqueueSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'

const NewEnroll = ({ id }) => {
  const { mutate } = useSWRConfig()
  const { data: students, isLoading } = useSWR('/students')
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(prev => !prev)

  if (isLoading) return null

  return (
    <>
      <Button variant='contained' onClick={toggleOpen} size='small' startIcon={<AddIcon />}>
        Matricular
      </Button>
      <CustomDialog
        open={open}
        handleClose={toggleOpen}
        title='Matricular estudiante'
      >
        <Formik
          initialValues={{
            courseId: id,
            studentId: '',
            emittedAt: new Date(),
            finishedAt: new Date(),
            note: 0
          }}
          validationSchema={Yup.object().shape({
            studentId: Yup.string().required('El estudiante es requerido'),
            emittedAt: Yup.date().required('La fecha de emisión es requerida'),
            finishedAt: Yup.date().required('La fecha de finalización es requerida'),
            note: Yup.number().min(0, 'no puede ser menor a 0').required('La nota es requerida')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true)
              const enroll = [{
                courseId: values.courseId,
                emittedAt: new Date(values.emittedAt),
                finishedAt: new Date(values.finishedAt),
                note: values.note
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
                  <TextField
                    select
                    fullWidth
                    variant='outlined'
                    label='Estudiante'
                    name='studentId'
                    value={values.studentId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.studentId && errors.studentId)}
                    helperText={touched.studentId && errors.studentId}
                  >
                    {students?.map(student => (
                      <MenuItem key={student.id} value={student.id}>
                        {`${student.user.dni} - ${student.user.name} ${student.user.lastname}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    label='Fecha de emisión'
                    name='emittedAt'
                    type='date'
                    size='small'
                    value={values.emittedAt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.emittedAt && errors.emittedAt)}
                    helperText={touched.emittedAt && errors.emittedAt}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    label='Fecha de finalización'
                    name='finishedAt'
                    type='date'
                    size='small'
                    value={values.finishedAt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.finishedAt && errors.finishedAt)}
                    helperText={touched.finishedAt && errors.finishedAt}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    label='Nota'
                    name='note'
                    type='number'
                    size='small'
                    value={values.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
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
                    matricular
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
