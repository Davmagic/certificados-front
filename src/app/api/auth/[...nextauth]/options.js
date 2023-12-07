import axiosInstance, { setAuthToken } from '@/helpers/axiosInstance'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your_email@domain.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        const { data: user } = await axiosInstance.post('/auth', {
          email: credentials?.email,
          password: credentials?.password
        })
        // If no error and we have user data, return it
        if (user) {
          setAuthToken(user.token)
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user }) {
      return { ...token, ...user }
    },
    async session ({ session, token }) {
      session.user = token
      return session
    }
  }
}
