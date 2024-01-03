'use client'
import { useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CustomDialog from '@/components/CustomDialog'
import FormCourse from './FormCourse'

const NewCourse = ({ data }) => {
  const [open, setOpen] = useState(false)
  const toggleDialog = () => setOpen((prev) => !prev)

  return (
    <>
      {data
        ? (
          <Tooltip title='Editar'>
            <IconButton color='primary' onClick={toggleDialog}>
              <EditIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
          )
        : (
          <Button
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            onClick={toggleDialog}
          >
            Nuevo Curso
          </Button>
          )}
      <CustomDialog
        open={open}
        handleClose={toggleDialog}
        title={data ? 'Editar Curso' : 'Nuevo Curso'}
      >
        <FormCourse data={data} />
      </CustomDialog>
    </>
  )
}

export default NewCourse
