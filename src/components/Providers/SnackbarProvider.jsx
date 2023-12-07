'use client'
import { SnackbarProvider } from 'notistack'

const SnackProvider = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      {children}
    </SnackbarProvider>
  )
}

export default SnackProvider
