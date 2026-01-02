import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Enrollment } from '../../api/applicant'
import EmptyState from './EmptyState'

interface EnrollmentsCardProps {
  enrollments: Enrollment[]
}

export default function EnrollmentsCard({ enrollments }: EnrollmentsCardProps) {
  const displayEnrollments = enrollments.slice(0, 3)
  const activeEnrollments = displayEnrollments.filter((e) => e.active_status === 'Y')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Available Enrollments</h2>
        </div>
      </div>

      {activeEnrollments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No active enrollments"
          description="Check back later for new enrollment opportunities"
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {displayEnrollments.map((enrollment) => (
            <div
              key={enrollment.enroll_id}
              className={`p-3 sm:p-4 rounded-xl border-2 transition ${
                enrollment.active_status === 'Y'
                  ? 'border-primary-200 bg-primary-50 hover:border-primary-300'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{enrollment.enroll_title}</h3>
                  {enrollment.enroll_desc && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{enrollment.enroll_desc}</p>
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">
                        {formatDate(enrollment.enroll_start_date)} - {formatDate(enrollment.enroll_end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">{enrollment.center_name}</span>
                    </div>
                  </div>
                </div>
                <button
                  disabled={enrollment.active_status !== 'Y'}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition w-full sm:w-auto flex-shrink-0 ${
                    enrollment.active_status === 'Y'
                      ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (enrollment.active_status === 'Y') {
                      console.log('Apply to enrollment:', enrollment.enroll_id)
                    }
                  }}
                >
                  Apply
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {enrollments.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all enrollments →
          </button>
        </div>
      )}
    </motion.div>
  )
}

