'use client'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import * as Yup from 'yup'
import { FieldArray, Formik } from 'formik'
import { enqueueSnackbar } from 'notistack'
import { Button, Grid, IconButton, MenuItem, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import axiosInstance from '@/helpers/axiosInstance'
import CustomDialog from '@/components/CustomDialog'
import LoadingData from '@/components/LoadingData'

const baseEnroll = {
  note: 0,
  finishedAt: new Date(),
  emittedAt: new Date(),
  courseId: ''
}

const NewEnroll = ({ id }) => {
  const { mutate } = useSWRConfig()
  const { data: courses, isLoading } = useSWR('/courses')
  const [open, setOpen] = useState(false)
  const toggleDialog = () => setOpen((prev) => !prev)

  if (isLoading) return <LoadingData />

  return (
    <>
      <Button
        variant='contained'
        size='small'
        startIcon={<AddIcon />}
        onClick={toggleDialog}
      >
        Nueva Matricula
      </Button>
      <CustomDialog
        open={open}
        handleClose={toggleDialog}
        title='Nueva Matricula'
      >
        <Formik
          initialValues={{
            enrolls: [baseEnroll]
          }}
          validationSchema={Yup.object().shape({
            enrolls: Yup.array().of(
              Yup.object().shape({
                note: Yup.number().min(0, 'debe ser mayor que 0').required('La nota es requerida'),
                finishedAt: Yup.date().required('La fecha de finalizacion es requerida'),
                emittedAt: Yup.date().required('La fecha de emision es requerida'),
                courseId: Yup.string().required('El curso es requerido')
              })
            )
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const parsedValues = values.enrolls.map((enroll) => ({
                ...enroll,
                finishedAt: new Date(enroll.finishedAt),
                emittedAt: new Date(enroll.emittedAt)
              }))
              await axiosInstance.post(`/students/${id}/enroll`, { enrolls: parsedValues })
              enqueueSnackbar('Matricula(s) creada(s) correctamente', { variant: 'success' })
              mutate(`/students/${id}/enrolls`)
              toggleDialog()
            } catch (error) {
              console.log(error)
              enqueueSnackbar('Error al crear matricula', { variant: 'error' })
            }
            setSubmitting(false)
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
              <FieldArray name='enrolls'>
                {({ push, remove }) => (
                  <>
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      onClick={() => push(baseEnroll)}
                      sx={{ mb: 2, alignSelf: 'flex-end' }}
                    >
                      Agregar Matricula
                    </Button>
                    {values.enrolls.map((enroll, index) => (
                      <Grid key={index} container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label='Curso'
                            name={`enrolls.${index}.courseId`}
                            value={enroll.courseId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            select
                            error={Boolean(touched.enrolls?.[index]?.courseId && errors.enrolls?.[index]?.courseId)}
                            helperText={touched.enrolls?.[index]?.courseId && errors.enrolls?.[index]?.courseId}
                          >
                            {courses?.map((course) => (
                              <MenuItem key={course.id} value={course.id}>
                                {course.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Fecha de finalizacion'
                            name={`enrolls.${index}.finishedAt`}
                            type='date'
                            value={enroll.finishedAt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.enrolls?.[index]?.finishedAt && errors.enrolls?.[index]?.finishedAt)}
                            helperText={touched.enrolls?.[index]?.finishedAt && errors.enrolls?.[index]?.finishedAt}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Fecha de emision'
                            name={`enrolls.${index}.emittedAt`}
                            type='date'
                            value={enroll.emittedAt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.enrolls?.[index]?.emittedAt && errors.enrolls?.[index]?.emittedAt)}
                            helperText={touched.enrolls?.[index]?.emittedAt && errors.enrolls?.[index]?.emittedAt}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Nota'
                            type='number'
                            name={`enrolls.${index}.note`}
                            value={enroll.note}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.enrolls?.[index]?.note && errors.enrolls?.[index]?.note)}
                            helperText={touched.enrolls?.[index]?.note && errors.enrolls?.[index]?.note}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <IconButton
                            color='error'
                            size='small'
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                )}
              </FieldArray>
              <Button type='submit' fullWidth variant='contained' disabled={isSubmitting} sx={{ mt: 2 }}>
                Registrar matricula(s)
              </Button>
            </form>
          )}
        </Formik>
      </CustomDialog>
    </>
  )
}

export default NewEnroll
