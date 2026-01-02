import axios from 'axios'
import { useAuthStore } from '../store/authStore'

  baseURL: API_BASE_URL,
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      // Ensure token doesn't have extra whitespace
      const cleanToken = accessToken.trim()
      config.headers.Authorization = `Bearer ${cleanToken}`
      // Debug log for auth endpoints
      if (config.url?.includes('/auth/')) {
        console.debug(`[API] Adding auth token to ${config.url}, token length: ${cleanToken.length}`)
      }
    } else if (config.url?.includes('/auth/me')) {
      console.warn('[API] No access token available for /auth/me request')
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, clearAuth } = useAuthStore.getState()
        if (!refreshToken) {
          clearAuth()
          // Only redirect if not already on login page
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login'
          }
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )

        const { access_token, refresh_token } = response.data
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          access_token,
          refresh_token
        )

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
      } catch (refreshError) {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        useAuthStore.getState().clearAuth()
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
        // Only redirect if not already on login page
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken.trim()}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
        if (window.location.pathname !== '/auth/login') {
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, clearAuth } = useAuthStore.getState()
        if (!refreshToken) {
          clearAuth()
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )

        const { access_token } = response.data
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          access_token,
          refresh_token
        )

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

