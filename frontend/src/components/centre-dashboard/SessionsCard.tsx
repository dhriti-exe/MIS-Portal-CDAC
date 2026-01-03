import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Calendar, Clock, CheckCircle2, XCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { Session, centerAPI } from '../../api/center'
import EmptyState from '../applicant-dashboard/EmptyState'
import StatusPill from '../applicant-dashboard/StatusPill'
import SessionModal from './SessionModal'

interface SessionsCardProps {
  sessions: Session[]
  onRefresh: () => void
}

export default function SessionsCard({ sessions, onRefresh }: SessionsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const displaySessions = sessions.slice(0, 5)

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

  const handleCreate = () => {
    setSelectedSession(null)
    setIsModalOpen(true)
  }

  const handleEdit = (session: Session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  const handleDelete = async (sessionId: number) => {
    const session = sessions.find(s => s.session_id === sessionId)
    const sessionName = session?.session_name || 'this session'

    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Delete Session?
              </p>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <span className="font-medium">"{sessionName}"</span>? This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                setDeleting(sessionId)
                const loadingToastId = toast.loading('Deleting session...')
                try {
                  await centerAPI.deleteSession(sessionId)
                  toast.success('Session deleted successfully', { id: loadingToastId })
                  onRefresh()
                } catch (err: any) {
                  toast.error(err.response?.data?.detail || 'Failed to delete session. Please try again.', { id: loadingToastId })
                } finally {
                  setDeleting(null)
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          minWidth: '320px',
          maxWidth: '420px',
        },
      }
    )
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  const handleModalSuccess = () => {
    onRefresh()
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
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {sessions.length} Total
          </span>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Session</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {displaySessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No sessions found"
          description="Create your first training session to get started"
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
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Active
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
                        {session.active_status === 'Y' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                            onClick={() => handleEdit(session)}
                            title="Edit session"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            onClick={() => handleDelete(session.session_id)}
                            disabled={deleting === session.session_id}
                            title="Delete session"
                          >
                            <Trash2 className="h-4 w-4" />
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
                      <div className="flex items-center gap-2">
                        <StatusPill status={status} />
                        {session.active_status === 'Y' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                          onClick={() => handleEdit(session)}
                          title="Edit session"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          onClick={() => handleDelete(session.session_id)}
                          disabled={deleting === session.session_id}
                          title="Delete session"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

      <SessionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        session={selectedSession}
      />
    </motion.div>
  )
}

