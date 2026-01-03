import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar } from 'lucide-react'
import { Session, SessionCreate, centerAPI } from '../../api/center'

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  session?: Session | null
}

const sessionSchema = z.object({
  session_name: z.string().min(1, 'Session name is required').max(20, 'Session name must be 20 characters or less'),
  session_desc: z.string().min(1, 'Session description is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  active_status: z.enum(['Y', 'N'], { required_error: 'Active status is required' }),
}).refine((data) => {
  const startDate = new Date(data.start_date)
  const endDate = new Date(data.end_date)
  return endDate > startDate
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
})

type SessionFormData = z.infer<typeof sessionSchema>

export default function SessionModal({ isOpen, onClose, onSuccess, session }: SessionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!session

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      session_name: '',
      session_desc: '',
      start_date: '',
      end_date: '',
      active_status: 'N',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (session) {
        // Format dates for input (YYYY-MM-DDTHH:mm)
        const startDate = new Date(session.start_date)
        const endDate = new Date(session.end_date)
        reset({
          session_name: session.session_name,
          session_desc: session.session_desc,
          start_date: startDate.toISOString().slice(0, 16),
          end_date: endDate.toISOString().slice(0, 16),
          active_status: session.active_status as 'Y' | 'N',
        })
      } else {
        reset({
          session_name: '',
          session_desc: '',
          start_date: '',
          end_date: '',
          active_status: 'N',
        })
      }
      setError(null)
    }
  }, [isOpen, session, reset])

  const onSubmit = async (data: SessionFormData) => {
    setError(null)
    setLoading(true)
    try {
      const sessionData: SessionCreate = {
        session_name: data.session_name,
        session_desc: data.session_desc,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        active_status: data.active_status,
      }

      if (isEditing && session) {
        await centerAPI.updateSession(session.session_id, sessionData)
      } else {
        await centerAPI.createSession(sessionData)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Session' : 'Create New Session'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('session_name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                  errors.session_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Summer 2024"
                maxLength={20}
              />
              {errors.session_name && (
                <p className="mt-1 text-sm text-red-600">{errors.session_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('session_desc')}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none text-gray-900 ${
                  errors.session_desc ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter session description"
              />
              {errors.session_desc && (
                <p className="mt-1 text-sm text-red-600">{errors.session_desc.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('start_date')}
                  type="datetime-local"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('end_date')}
                  type="datetime-local"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                    errors.end_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('active_status')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                  errors.active_status ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="N">Inactive</option>
                <option value="Y">Active</option>
              </select>
              {errors.active_status && (
                <p className="mt-1 text-sm text-red-600">{errors.active_status.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

