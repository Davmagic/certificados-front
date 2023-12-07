import { useState } from 'react'
import { Tooltip, IconButton, CircularProgress } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import axiosInstance from '@/helpers/axiosInstance'
import createPDF from '@/libs/utils/createPDF'

const ExportEnrollButton = ({ id }) => {
  const [loading, setLoading] = useState(false)
  const handleExport = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get(`/enrolls/${id}`)
      await createPDF(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Tooltip title='Exportar Archivo'>
      <IconButton aria-label='exportar' size='small' onClick={handleExport} disabled={loading} color='secondary'>
        {loading ? <CircularProgress size={15} /> : <PictureAsPdfIcon fontSize='inherit' />}
      </IconButton>
    </Tooltip>
  )
}

export default ExportEnrollButton
