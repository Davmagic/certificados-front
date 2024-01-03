'use client'
import { setAuthToken } from '@/helpers/axiosInstance'
import { SessionProvider, getSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function AuthProvider ({
  children,
  session
}) {
  // const router = useRouter()
  useEffect(() => {
    getSession().then(session => {
      if (session) {
        localStorage.setItem('token', session.user.token)
        setAuthToken(session.user.token)
      } else {
        const token = localStorage.getItem('token')
        setAuthToken(token)
        // router.push('/api/auth/signin')
      }
    })
  }, [])

  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default AuthProvider
