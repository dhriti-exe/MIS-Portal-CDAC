import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { authAPI } from '../api/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'applicant' | 'centre' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, accessToken, setAuth } = useAuthStore()
  const [isVerifying, setIsVerifying] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (accessToken && !user && !isVerifying) {
      setIsVerifying(true)
      const verifyAuth = async () => {
        try {
          const userData = await authAPI.getMe()
          const refreshToken = useAuthStore.getState().refreshToken || ''
          const userWithIsActive = {
            ...userData,
            is_active: true,
            role: userData.role as 'applicant' | 'centre' | 'admin',
          }
          setAuth(userWithIsActive, accessToken, refreshToken)
        } catch (error: any) {
          console.error('Token validation failed:', error.response?.data?.detail || error.message)
        } finally {
          setIsVerifying(false)
        }
      }
      verifyAuth()
    }
  }, [accessToken, user, setAuth, isVerifying])

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  // Check if applicant needs onboarding, but don't redirect if already on onboarding page
  if (user?.role === 'applicant' && !user.applicant_id && location.pathname !== '/onboarding/applicant') {
    return <Navigate to="/onboarding/applicant" replace />
  }

  // Check if center needs onboarding, but don't redirect if already on onboarding page
  if (user?.role === 'centre' && !user.center_id && location.pathname !== '/onboarding/center') {
    return <Navigate to="/onboarding/center" replace />
  }

  return <>{children}</>
}

