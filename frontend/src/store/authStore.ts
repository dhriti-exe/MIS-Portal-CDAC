import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  role: 'applicant' | 'centre' | 'admin'
  is_active: boolean
  applicant_id?: number | null
  center_id?: number | null
  employee_id?: number | null
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ 
          user, 
          accessToken: accessToken?.trim() || null, 
          refreshToken: refreshToken?.trim() || null 
        }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

