import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, MapPin, Phone, Mail, Globe, Edit, Save, X } from 'lucide-react'
import { CenterProfile, CenterCreate, centerAPI } from '../../api/center'
import { masterDataAPI } from '../../api/masterData'

interface ProfileSectionProps {
  profile: CenterProfile | null
  onUpdate?: (profile: CenterProfile) => void
}

const profileSchema = z.object({
  center_name: z.string().min(1, 'Center name is required').max(100, 'Center name must be 100 characters or less'),
  center_code: z.string().max(10, 'Center code must be 10 characters or less').optional().or(z.literal('')),
  center_venue: z.string().max(100, 'Center venue must be 100 characters or less').optional().or(z.literal('')),
  state_id: z.number().min(1, 'Please select a state'),
  district_id: z.number().min(1, 'Please select a district'),
  center_address: z.string().max(500, 'Address must be 500 characters or less').optional().or(z.literal('')),
  center_phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').min(1, 'Phone number is required'),
  center_mail_id: z.string().email('Invalid email address').optional().or(z.literal('')),
  center_pay_link: z.string().url('Invalid URL format').min(1, 'Payment link is required').max(255, 'Payment link must be 255 characters or less'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileSection({ profile, onUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  })

  const selectedState = watch('state_id')

  // Load master data on mount and when editing
  useEffect(() => {
    loadMasterData()
    if (profile?.state_id) {
      loadDistricts(profile.state_id)
    }
  }, [profile?.state_id])

  // Load districts when state changes in edit mode
  useEffect(() => {
    if (isEditing && selectedState && selectedState > 0) {
      loadDistricts(selectedState)
    }
  }, [selectedState, isEditing])


  // Initialize form when profile changes or editing starts
  useEffect(() => {
    if (profile) {
      if (isEditing) {
        reset({
          center_name: profile.center_name || '',
          center_code: profile.center_code || '',
          center_venue: profile.center_venue || '',
          state_id: profile.state_id || 0,
          district_id: profile.district_id || 0,
          center_address: profile.center_address || '',
          center_phone: profile.center_phone || '',
          center_mail_id: profile.center_mail_id || '',
          center_pay_link: profile.center_pay_link || '',
        })
        if (profile.state_id) {
          loadDistricts(profile.state_id)
        }
      }
    }
  }, [profile, isEditing, reset])

  const loadMasterData = async () => {
    try {
      setLoadingData(true)
      const statesData = await masterDataAPI.getStates()
      setStates(statesData)
    } catch (err) {
      console.error('Error loading states:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const loadDistricts = async (stateId: number) => {
    try {
      const districtsData = await masterDataAPI.getDistricts(stateId)
      setDistricts(districtsData || [])
    } catch (err) {
      console.error('Error loading districts:', err)
      setDistricts([])
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setError(null)
    setLoading(true)
    try {
      // Clean up optional fields
      const cleanedData: Partial<CenterCreate> = {
        center_name: data.center_name,
        state_id: data.state_id,
        district_id: data.district_id,
        center_code: data.center_code && data.center_code.trim() !== '' ? data.center_code.trim() : undefined,
        center_venue: data.center_venue && data.center_venue.trim() !== '' ? data.center_venue.trim() : undefined,
        center_address: data.center_address && data.center_address.trim() !== '' ? data.center_address.trim() : undefined,
        center_phone: data.center_phone.trim(),
        center_mail_id: data.center_mail_id && data.center_mail_id.trim() !== '' ? data.center_mail_id.trim() : undefined,
        center_pay_link: data.center_pay_link.trim(),
      }

      const updatedProfile = await centerAPI.updateProfile(cleanedData)
      
      if (onUpdate) {
        onUpdate(updatedProfile)
      }
      
      setIsEditing(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
    if (profile) {
      reset({
        center_name: profile.center_name || '',
        center_code: profile.center_code || '',
        center_venue: profile.center_venue || '',
        state_id: profile.state_id || 0,
        district_id: profile.district_id || 0,
        center_address: profile.center_address || '',
        center_phone: profile.center_phone || '',
        center_mail_id: profile.center_mail_id || '',
        center_pay_link: profile.center_pay_link || '',
      })
    }
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 text-center">
        <p className="text-gray-600">Profile information not available</p>
      </div>
    )
  }

  // Get state and district names for display
  const getStateName = () => {
    if (!profile.state_id) return 'N/A'
    const state = states.find(s => s.state_id === profile.state_id)
    return state?.state_name || 'N/A'
  }

  const getDistrictName = () => {
    if (!profile.district_id) return 'N/A'
    const district = districts.find(d => d.district_id === profile.district_id)
    return district?.district_name || 'N/A'
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Center Profile</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition font-medium"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Center Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('center_name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter center name"
                maxLength={100}
              />
              {errors.center_name && (
                <p className="mt-1 text-sm text-red-600">{errors.center_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Center Code
              </label>
              <input
                {...register('center_code')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter center code (optional)"
                maxLength={10}
              />
              {errors.center_code && (
                <p className="mt-1 text-sm text-red-600">{errors.center_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Center Venue
              </label>
              <input
                {...register('center_venue')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_venue ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter venue name (optional)"
                maxLength={100}
              />
              {errors.center_venue && (
                <p className="mt-1 text-sm text-red-600">{errors.center_venue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                {...register('state_id', { valueAsNumber: true })}
                disabled={loadingData}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.state_id ? 'border-red-300' : 'border-gray-300'
                } ${loadingData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value={0}>Select State</option>
                {states.map((state) => (
                  <option key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              {errors.state_id && (
                <p className="mt-1 text-sm text-red-600">{errors.state_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <select
                {...register('district_id', { valueAsNumber: true })}
                disabled={!selectedState || selectedState === 0 || districts.length === 0}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.district_id ? 'border-red-300' : 'border-gray-300'
                } ${!selectedState || selectedState === 0 || districts.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value={0}>
                  {districts.length === 0 && selectedState ? 'Loading districts...' : 'Select District'}
                </option>
                {districts.map((district) => (
                  <option key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
              {errors.district_id && (
                <p className="mt-1 text-sm text-red-600">{errors.district_id.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                {...register('center_address')}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none text-gray-900 ${
                  errors.center_address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter center address (optional)"
                maxLength={500}
              />
              {errors.center_address && (
                <p className="mt-1 text-sm text-red-600">{errors.center_address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('center_phone')}
                type="tel"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="10 digit phone number"
                maxLength={10}
              />
              {errors.center_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.center_phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('center_mail_id')}
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_mail_id ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="center@example.com (optional)"
              />
              {errors.center_mail_id && (
                <p className="mt-1 text-sm text-red-600">{errors.center_mail_id.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Link <span className="text-red-500">*</span>
              </label>
              <input
                {...register('center_pay_link')}
                type="url"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                  errors.center_pay_link ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://payment.example.com"
              />
              {errors.center_pay_link && (
                <p className="mt-1 text-sm text-red-600">{errors.center_pay_link.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Center Name
                </label>
              </div>
              <p className="text-sm font-medium text-gray-900">{profile.center_name}</p>
            </div>

            {profile.center_code && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Center Code
                  </label>
                </div>
                <p className="text-sm font-medium text-gray-900">{profile.center_code}</p>
              </div>
            )}

            {profile.center_venue && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Venue
                  </label>
                </div>
                <p className="text-sm font-medium text-gray-900">{profile.center_venue}</p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  State
                </label>
              </div>
              <p className="text-sm font-medium text-gray-900">{getStateName()}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  District
                </label>
              </div>
              <p className="text-sm font-medium text-gray-900">{getDistrictName()}</p>
            </div>

            {profile.center_address && (
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </label>
                </div>
                <p className="text-sm text-gray-900">{profile.center_address}</p>
              </div>
            )}

            {profile.center_phone && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </label>
                </div>
                <p className="text-sm font-medium text-gray-900">{profile.center_phone}</p>
              </div>
            )}

            {profile.center_mail_id && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </label>
                </div>
                <p className="text-sm font-medium text-gray-900">{profile.center_mail_id}</p>
              </div>
            )}

            {profile.center_pay_link && (
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Link
                  </label>
                </div>
                <a
                  href={profile.center_pay_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {profile.center_pay_link}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
