import { motion } from 'framer-motion'
import { Bell, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Application } from '../../api/applicant'
import EmptyState from './EmptyState'

interface NotificationsCardProps {
  applications: Application[]
}

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  date: string
  relatedApplicationId?: number
}

export default function NotificationsCard({ applications }: NotificationsCardProps) {
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = []
    const now = new Date()

    applications.forEach((app) => {
      const updatedDate = new Date(app.updated_date)
      const daysSinceUpdate = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24))

      // Application status notifications
      if (app.application_status === 'Selected') {
        notifications.push({
          id: `selected-${app.application_id}`,
          type: 'success',
          title: 'Application Selected',
          message: `Your application for "${app.enrollment_title}" has been selected!`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      } else if (app.application_status === 'Rejected') {
        notifications.push({
          id: `rejected-${app.application_id}`,
          type: 'error',
          title: 'Application Rejected',
          message: `Your application for "${app.enrollment_title}" was not selected.`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      }

      // Payment notifications
      if (app.application_status === 'Selected' && app.payment_status === 'Unpaid') {
        notifications.push({
          id: `payment-${app.application_id}`,
          type: 'warning',
          title: 'Payment Pending',
          message: `Please complete payment for "${app.enrollment_title}" to secure your enrollment.`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      } else if (app.payment_status === 'Paid') {
        notifications.push({
          id: `paid-${app.application_id}`,
          type: 'success',
          title: 'Payment Confirmed',
          message: `Payment for "${app.enrollment_title}" has been confirmed.`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      }

      // Certificate notifications
      if (app.certificate_status === 'Issued') {
        notifications.push({
          id: `cert-${app.application_id}`,
          type: 'success',
          title: 'Certificate Available',
          message: `Your certificate for "${app.enrollment_title}" is now available for download.`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      }

      // Recent updates
      if (daysSinceUpdate <= 7 && app.application_status === 'Submitted') {
        notifications.push({
          id: `update-${app.application_id}`,
          type: 'info',
          title: 'Application Under Review',
          message: `Your application for "${app.enrollment_title}" is being reviewed.`,
          date: app.updated_date,
          relatedApplicationId: app.application_id,
        })
      }
    })

    // Sort by date (newest first)
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
  }

  const notifications = generateNotifications()
  const displayNotifications = notifications.slice(0, 10)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'error':
        return XCircle
      case 'warning':
        return AlertCircle
      default:
        return Clock
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-blue-600 bg-blue-100'
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
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notifications</h2>
      </div>

      {displayNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {displayNotifications.map((notification) => {
            const Icon = getIcon(notification.type)
            const iconColor = getIconColor(notification.type)

            return (
              <div
                key={notification.id}
                className="p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition cursor-pointer active:bg-primary-100"
                onClick={() => {
                  if (notification.relatedApplicationId) {
                    console.log('View application:', notification.relatedApplicationId)
                  }
                }}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${iconColor} flex-shrink-0`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{notification.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatDate(notification.date)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

