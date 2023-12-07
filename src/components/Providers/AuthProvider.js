'use client'
import { setAuthToken } from '@/helpers/axiosInstance'
import { SessionProvider, getSession } from 'next-auth/react'
import { useEffect } from 'react'

function AuthProvider ({ children }) {
  useEffect(() => {
    getSession().then(session => {
      if (session) {
        setAuthToken(session.user.token)
      }
    })
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
