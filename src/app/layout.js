import * as React from 'react'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import './globals.css'
import AuthProvider from '@/components/Providers/AuthProvider'
import SnackProvider from '@/components/Providers/SnackbarProvider'
import SWRProvider from '@/components/Providers/SWRProvider'
import MiniDrawer from '@/components/MiniDrawer'

export const metadata = {
  title: {
    template: '%s | Centro Certificados',
    default: 'Centro Certificados'
  },
  description: 'Web App created with NextJS',
  authors: [{ name: 'Davmagic' }],
  creator: 'Davmagic',
  publisher: 'Davmagic'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry>
          <SnackProvider>
            <AuthProvider>
              <SWRProvider>
                <MiniDrawer>
                  {children}
                </MiniDrawer>
              </SWRProvider>
            </AuthProvider>
          </SnackProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
