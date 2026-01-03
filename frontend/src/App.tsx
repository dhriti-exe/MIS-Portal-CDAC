import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ApplicantOnboarding from './pages/ApplicantOnboarding'
import CenterOnboarding from './pages/CenterOnboarding'
import ApplicantDashboard from './pages/ApplicantDashboard'
import CentreDashboard from './pages/CentreDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        
        {/* Protected routes */}
        <Route
          path="/onboarding/applicant"
          element={
            <ProtectedRoute>
              <ApplicantOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/center"
          element={
            <ProtectedRoute requiredRole="centre">
              <CenterOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/dashboard"
          element={
            <ProtectedRoute requiredRole="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/centre/dashboard"
          element={
            <ProtectedRoute requiredRole="centre">
              <CentreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

