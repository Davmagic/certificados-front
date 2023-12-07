'use client'
import { SWRConfig } from 'swr'
import axiosInstance from '@/helpers/axiosInstance'

const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axiosInstance.get(url).then((res) => res.data)
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWRProvider
