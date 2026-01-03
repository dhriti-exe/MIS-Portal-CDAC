import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { centerAPI, Session, Application, NewsItem, CenterProfile } from '../api/center'
import CentreSidebar, { CentreSection } from '../components/centre-dashboard/CentreSidebar'
import SessionsCard from '../components/centre-dashboard/SessionsCard'
import ApplicationsCard from '../components/centre-dashboard/ApplicationsCard'
import NewsCard from '../components/centre-dashboard/NewsCard'
import ProfileSection from '../components/centre-dashboard/ProfileSection'

export default function CentreDashboard() {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const [activeSection, setActiveSection] = useState<CentreSection>('sessions')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [profile, setProfile] = useState<CenterProfile | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data in parallel
      const [sessionsData, applicationsData, newsData, profileData] = await Promise.all([
        centerAPI.getSessions().catch(() => []),
        centerAPI.getApplications().catch(() => []),
        centerAPI.getNews().catch(() => []),
        centerAPI.getProfile().catch(() => null),
      ])

      setSessions(sessionsData)
      setApplications(applicationsData)
      setNews(newsData)
      setProfile(profileData)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'sessions':
        return <SessionsCard sessions={sessions} onRefresh={loadDashboardData} />
      case 'applications':
        return <ApplicationsCard applications={applications} />
      case 'news':
        return <NewsCard news={news} />
      case 'profile':
        return <ProfileSection profile={profile} onUpdate={(updatedProfile) => setProfile(updatedProfile)} />
      default:
        return null
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">Training Portal</h1>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Centre Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition active:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-6 relative">
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className={`${
            sidebarOpen 
              ? 'fixed right-0 top-14 sm:top-16 bottom-0 z-50 lg:left-0 lg:relative lg:top-0 transition-transform duration-300 ease-out' 
              : 'hidden lg:block'
          } w-64 lg:w-64 flex-shrink-0`}>
            <CentreSidebar
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setSidebarOpen(false);
              }}
              onLogout={handleLogout}
              profile={profile}
            />
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.96 }}
                transition={{ 
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

