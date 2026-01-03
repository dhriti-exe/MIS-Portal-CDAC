import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Eye } from 'lucide-react'
import { Session, Application } from '../../api/applicant'
import EmptyState from './EmptyState'
import StatusPill from './StatusPill'
import SessionDetailModal from './SessionDetailModal'

interface SessionsCardProps {
  sessions: Session[]
  applications: Application[]
  onRefresh: () => void
}

export default function SessionsCard({ sessions, applications, onRefresh }: SessionsCardProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const displaySessions = sessions.slice(0, 5)

  const hasAppliedToSession = (session: Session) => {
    // Check if applicant has already applied to this session
    // We match by session name since Application doesn't have session_id directly
    return applications.some(app => app.session_name === session.session_name)
  }

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  const handleModalSuccess = () => {
    onRefresh()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getSessionStatus = (session: Session) => {
    const now = new Date()
    const startDate = new Date(session.start_date)
    const endDate = new Date(session.end_date)
    
    if (now < startDate) return 'upcoming'
    if (now >= startDate && now <= endDate) return 'ongoing'
    return 'completed'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Training Sessions</h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          {sessions.length} Available
        </span>
      </div>

      {displaySessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No sessions available"
          description="Check back later for new training sessions"
        />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displaySessions.map((session) => {
                  const status = getSessionStatus(session)
                  return (
                    <tr key={session.session_id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{session.session_name}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{session.session_desc}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {formatDate(session.start_date)} - {formatDate(session.end_date)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <StatusPill status={status} />
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleViewDetails(session)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {displaySessions.map((session) => {
              const status = getSessionStatus(session)
              return (
                <div
                  key={session.session_id}
                  className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{session.session_name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{session.session_desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {formatDate(session.start_date)} - {formatDate(session.end_date)}
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusPill status={status} />
                      <button
                        onClick={() => handleViewDetails(session)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition font-medium"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {sessions.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all sessions →
          </button>
        </div>
      )}

      <SessionDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        session={selectedSession}
        hasApplied={selectedSession ? hasAppliedToSession(selectedSession) : false}
      />
    </motion.div>
  )
}

