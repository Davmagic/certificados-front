'use client'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import * as Yup from 'yup'
import { FieldArray, Formik } from 'formik'
import { enqueueSnackbar } from 'notistack'
import { Autocomplete, Button, Grid, IconButton, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import axiosInstance from '@/helpers/axiosInstance'
import CustomDialog from '@/components/CustomDialog'
import LoadingData from '@/components/LoadingData'

const baseEnroll = {
  emittedAt: new Date(),
  courseId: '',
  bachelor: ''
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
        Registrar certificado
      </Button>
      <CustomDialog
        open={open}
        handleClose={toggleDialog}
        title='Registrar certificado'
      >
        <Formik
          initialValues={{
            enrolls: [baseEnroll]
          }}
          validationSchema={Yup.object().shape({
            enrolls: Yup.array().of(
              Yup.object().shape({
                emittedAt: Yup.date().required('La fecha de emision es requerida'),
                courseId: Yup.string().required('El curso es requerido')
              })
            )
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const parsedValues = values.enrolls.map((enroll) => ({
                ...enroll,
                emittedAt: new Date(enroll.emittedAt)
              }))
              await axiosInstance.post(`/students/${id}/enroll`, { enrolls: parsedValues })
              enqueueSnackbar('Certificado registrado correctamente', { variant: 'success' })
              mutate(`/students/${id}/enrolls`)
              toggleDialog()
            } catch (error) {
              console.log(error)
              enqueueSnackbar('Error al registrar la información', { variant: 'error' })
            }
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setValues
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
                      añadir certificado
                    </Button>
                    {values.enrolls.map((enroll, index) => (
                      <Grid key={index} container spacing={2}>
                        <Grid item xs={12}>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            options={courses}
                            size='small'
                            value={enroll.courseId ? courses.find((course) => course.id === enroll.courseId) : null}
                            getOptionLabel={(option) => `${option.name} - ${option.mode} - ${option.academy?.name}`}
                            onChange={(event, newValue) => {
                              setValues(prev => ({
                                enrolls: prev.enrolls.map((enroll, i) => {
                                  if (i === index) {
                                    return {
                                      ...enroll,
                                      courseId: newValue.id || '',
                                      bachelor: newValue.bachelor || ''
                                    }
                                  }
                                  return enroll
                                })
                              }))
                            }}
                            onBlur={handleBlur}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label='Curso'
                                variant='outlined'
                                error={Boolean(touched.enrolls?.[index]?.courseId && errors.enrolls?.[index]?.courseId)}
                                helperText={touched.enrolls?.[index]?.courseId && errors.enrolls?.[index]?.courseId}
                              />
                            )}
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
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Titulo del certificado'
                            name={`enrolls.${index}.bachelor`}
                            value={enroll.bachelor}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.enrolls?.[index]?.bachelor && errors.enrolls?.[index]?.bachelor)}
                            helperText={touched.enrolls?.[index]?.bachelor && errors.enrolls?.[index]?.bachelor}
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
                Registrar certificado(s)
              </Button>
            </form>
          )}
        </Formik>
      </CustomDialog>
    </>
  )
}

export default NewEnroll
