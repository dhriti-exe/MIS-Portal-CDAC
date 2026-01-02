import { motion } from 'framer-motion'
import { Eye, FileText } from 'lucide-react'
import { Application } from '../../api/applicant'
import StatusPill from './StatusPill'
import EmptyState from './EmptyState'

interface ApplicationsCardProps {
  applications: Application[]
}

export default function ApplicationsCard({ applications }: ApplicationsCardProps) {
  const displayApplications = applications.slice(0, 5)

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
          <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Applications</h2>
        </div>
      </div>

      {displayApplications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start by applying to an available enrollment"
        />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Center
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
                        <div className="font-medium text-gray-900 text-sm">{app.enrollment_title}</div>
                        <div className="text-xs text-gray-500 mt-1">{app.session_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm text-gray-700">{app.center_name}</div>
                    </td>
                    <td className="py-4 px-2">
                      <StatusPill status={app.application_status} />
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
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition"
                          onClick={() => {
                            console.log('View application:', app.application_id)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
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
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{app.enrollment_title}</h3>
                    <p className="text-xs text-gray-600">{app.session_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{app.center_name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill status={app.application_status} />
                    <StatusPill status={app.payment_status} />
                    <StatusPill status={app.certificate_status} />
                  </div>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition font-medium"
                    onClick={() => {
                      console.log('View application:', app.application_id)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {applications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all applications →
          </button>
        </div>
      )}
    </motion.div>
  )
}

