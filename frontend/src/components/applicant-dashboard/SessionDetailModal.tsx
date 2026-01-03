import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { Session, applicantAPI, ApplicationCreate } from '../../api/applicant'
import { masterDataAPI, Qualification, Stream } from '../../api/masterData'
import StatusPill from './StatusPill'

interface SessionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  session: Session | null
  hasApplied: boolean
}

const applicationSchema = z.object({
  qualification_id: z.number().min(1, 'Qualification is required'),
  stream_id: z.number().min(1, 'Stream is required'),
  marks: z.string().min(1, 'Marks are required').max(5, 'Marks must be 5 characters or less'),
  role_id: z.number().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export default function SessionDetailModal({ isOpen, onClose, onSuccess, session, hasApplied }: SessionDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      qualification_id: 0,
      stream_id: 0,
      marks: '',
      role_id: 4,
    },
  })

  const selectedQualification = watch('qualification_id')

  useEffect(() => {
    if (isOpen) {
      loadMasterData()
      reset({
        qualification_id: 0,
        stream_id: 0,
        marks: '',
        role_id: 4,
      })
      setError(null)
    }
  }, [isOpen, reset])

  const loadMasterData = async () => {
    setLoadingData(true)
    try {
      const [quals, strms] = await Promise.all([
        masterDataAPI.getQualifications().catch(() => []),
        masterDataAPI.getStreams().catch(() => []),
      ])
      setQualifications(quals)
      setStreams(strms)
    } catch (err) {
      console.error('Error loading master data:', err)
    } finally {
      setLoadingData(false)
    }
  }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
//   }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getSessionStatus = (session: Session) => {
    const now = new Date()
    const startDate = new Date(session.start_date)
    const endDate = new Date(session.end_date)
    
    if (now < startDate) return 'upcoming'
    if (now >= startDate && now <= endDate) return 'ongoing'
    return 'completed'
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!session) return

    setError(null)
    setLoading(true)
    const toastId = toast.loading('Submitting application...')
    try {
      // Use session.enroll_id if available, otherwise show error
      const enroll_id = (session as any).enroll_id || 0;
      if (!enroll_id) {
        toast.error('No enrollment/news is associated with this session. Please contact admin.', { id: toastId })
        setLoading(false)
        return;
      }
      const applicationData: ApplicationCreate = {
        session_id: session.session_id,
        enroll_id,
        qualification_id: data.qualification_id,
        stream_id: data.stream_id,
        marks: data.marks,
        role_id: data.role_id || 4,
      }

      await applicantAPI.createApplication(applicationData)
      toast.success('Application submitted successfully!', { id: toastId })
      onSuccess()
      onClose()
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to submit application. Please try again.'
      toast.error(errorMsg, { id: toastId })
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !session) return null

  const status = getSessionStatus(session)
  const filteredStreams = selectedQualification
    ? streams.filter(s => s.qual_code === qualifications.find(q => q.qualification_id === selectedQualification)?.qual_code)
    : streams

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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Session Info */}
            <div className="mb-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{session.session_name}</h3>
                <p className="text-gray-600">{session.session_desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                    <p className="text-sm text-gray-600">{formatDateTime(session.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">End Date</p>
                    <p className="text-sm text-gray-600">{formatDateTime(session.end_date)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <StatusPill status={status} />
                {session.active_status === 'Y' && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Application Form */}
            {hasApplied ? (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <CheckCircle2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Already Applied</h3>
                <p className="text-sm text-gray-600">You have already submitted an application for this session.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('qualification_id', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                        errors.qualification_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={loadingData}
                    >
                      <option value={0}>Select Qualification</option>
                      {qualifications.map((qual) => (
                        <option key={qual.qualification_id} value={qual.qualification_id}>
                          {qual.qualification_name}
                        </option>
                      ))}
                    </select>
                    {errors.qualification_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.qualification_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('stream_id', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                        errors.stream_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={loadingData || !selectedQualification}
                    >
                      <option value={0}>Select Stream</option>
                      {filteredStreams.map((stream) => (
                        <option key={stream.stream_id} value={stream.stream_id}>
                          {stream.stream_name}
                        </option>
                      ))}
                    </select>
                    {errors.stream_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.stream_id.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('marks')}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 ${
                      errors.marks ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 85.5"
                    maxLength={5}
                  />
                  {errors.marks && (
                    <p className="mt-1 text-sm text-red-600">{errors.marks.message}</p>
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
                    disabled={loading || loadingData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Apply for Session'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

