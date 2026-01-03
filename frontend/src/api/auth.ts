import apiClient from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  role: 'applicant' | 'centre' | 'admin'
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: number;
  email: string;
  role: 'applicant' | 'centre' | 'admin';
  is_active?: boolean;
  applicant_id?: number | null;
  center_id?: number | null;
  employee_id?: number | null;
  [key: string]: any;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data)
    return response.data
  },
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
  getMeWithToken: async (token: string): Promise<User> => {
    const axios = (await import('axios')).default
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    const response = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token.trim()}` },
    })
    return response.data
  },
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    )
    return response.data
  },
}

