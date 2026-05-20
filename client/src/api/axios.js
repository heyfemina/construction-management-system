import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const technicalMessage =
      error.response?.data?.message ||
      error.message ||
      ''

    const isConnectionError =
      technicalMessage.includes('getaddrinfo') ||
      technicalMessage.includes('EAI_AGAIN') ||
      technicalMessage.includes('ECONNREFUSED') ||
      technicalMessage.includes('ECONNRESET') ||
      technicalMessage.includes('pooler.supabase.com') ||
      technicalMessage.includes('supabase.com')

    if (isConnectionError) {
      const friendlyMessage =
        'Could not complete this request. Please try again.'

      error.isConnectionError = true

      if (error.response?.data) {
        error.response.data.message = friendlyMessage
      } else {
        error.message = friendlyMessage
      }
    }

    return Promise.reject(error)
  }
)

export default API
