import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import QrCodeIcon from '@mui/icons-material/QrCode'
import CustomDialog from './CustomDialog'
import { QR_BASE } from '@/libs/utils/createPDF'

const QrCodeButton = ({ enroll }) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(prev => !prev)
  return (
    <>
      <Tooltip title='Ver QR'>
        <IconButton aria-label='ver qr' size='small' onClick={toggleOpen} color='info'>
          <QrCodeIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
      <CustomDialog
        open={open}
        title='Codigo QR'
        handleClose={toggleOpen}
      >
        <Box className='p-2 bg-white mb-5'>
          <QRCode value={`${QR_BASE}/${enroll.id}`} level='L' />
        </Box>
        <Typography gutterBottom>
          <strong>Curso:</strong> {enroll.course?.name}
        </Typography>
      </CustomDialog>
    </>
  )
}

export default QrCodeButton
