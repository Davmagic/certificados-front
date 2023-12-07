import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

const setAuthToken = (token) => {
  // Define the default token to be sent on each axios request
  if (token) {
    axiosInstance.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axiosInstance.defaults.headers.common['x-auth-token']
  }
}
export { setAuthToken }
export default axiosInstance
