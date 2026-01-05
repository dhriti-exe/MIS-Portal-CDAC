import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, Mail, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Application } from '../../api/center'
import ApplicationDetailModal from './ApplicationDetailModal'
import EmptyState from '../applicant-dashboard/EmptyState'
import StatusPill from '../applicant-dashboard/StatusPill'

interface ApplicationsCardProps {
  applications: Application[]
}

export function ApplicationsCard({ applications }: ApplicationsCardProps) {
  const displayApplications = applications.slice(0, 5)

  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleReview = (app: Application) => {
    setSelectedApp(app)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedApp(null)
  }

  // TODO: Replace with real API call
  const handleApprove = (id: number) => {
    alert(`Approve application ${id}`)
    handleCloseModal()
  }
  const handleReject = (id: number) => {
    alert(`Reject application ${id}`)
    handleCloseModal()
  }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
//   }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Selected':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
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
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Applications</h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          {applications.length} Total
        </span>
      </div>

      {displayApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications yet"
          description="Applications will appear here once candidates start applying"
        />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayApplications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{app.applicant_name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Mail className="h-3 w-3" />
                          {app.applicant_email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{app.session_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(app.application_status)}
                        <StatusPill status={app.application_status} />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <StatusPill status={app.payment_status} />
                    </td>
                    <td className="py-4 px-2">
                      <StatusPill status={app.certificate_status} />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition font-medium"
                          onClick={() => handleReview(app)}
                        >
                          <Eye className="h-4 w-4" />
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {displayApplications.map((app) => (
              <div
                key={app.application_id}
                className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{app.applicant_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <Mail className="h-3 w-3" />
                      {app.applicant_email}
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="font-medium">{app.session_name}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(app.application_status)}
                      <StatusPill status={app.application_status} />
                    </div>
                    <StatusPill status={app.payment_status} />
                    <StatusPill status={app.certificate_status} />
                  </div>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition font-medium"
                    onClick={() => handleReview(app)}
                  >
                    <Eye className="h-4 w-4" />
                    Review Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {applications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            View all applications →
          </button>
        </div>
      )}
      <ApplicationDetailModal
        application={selectedApp}
        open={modalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </motion.div>
  )
}

