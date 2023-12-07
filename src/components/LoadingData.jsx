import React from 'react'
import { Box, CircularProgress } from '@mui/material'

const LoadingData = () => {
  return (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default LoadingData
