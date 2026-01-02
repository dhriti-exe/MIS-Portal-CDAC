import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ApplicantOnboarding from './pages/ApplicantOnboarding'
import ApplicantDashboard from './pages/ApplicantDashboard'
import CentreDashboard from './pages/CentreDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
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
  )
}

export default App

