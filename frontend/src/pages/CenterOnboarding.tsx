import { useState, useEffect } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { centerAPI, CenterCreate } from '../api/center'
import { masterDataAPI } from '../api/masterData'
import { useAuthStore } from '../store/authStore'

const onboardingSchema = z.object({
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

type OnboardingFormData = z.infer<typeof onboardingSchema>

const steps = [
  { number: 1, title: 'Basic Info' },
  { number: 2, title: 'Location' },
  { number: 3, title: 'Contact' },
]

export default function CenterOnboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
  })

  const selectedState = watch('state_id')

  // Set default email from user account
  useEffect(() => {
    if (user?.email) {
      setValue('center_mail_id', user.email)
    }
  }, [user, setValue])

  // Load master data on mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoadingData(true)
        const statesData = await masterDataAPI.getStates()
        // Filter to show only Maharashtra
        const maharashtraState = statesData.filter((state: any) => 
          state.state_name.toLowerCase().includes('maharashtra')
        )
        setStates(maharashtraState.length > 0 ? maharashtraState : statesData)
        
        // Auto-select Maharashtra if found and load its districts
        if (maharashtraState.length > 0) {
          const maharashtraId = maharashtraState[0].state_id
          setValue('state_id', maharashtraId)
          // Load districts for Maharashtra
          try {
            const districtsData = await masterDataAPI.getDistricts(maharashtraId)
            setDistricts(districtsData || [])
          } catch (err) {
            console.error('Error loading districts:', err)
          }
        }
      } catch (err) {
        setError('Failed to load master data. Please refresh the page.')
      } finally {
        setLoadingData(false)
      }
    }
    loadMasterData()
  }, [setValue])

  // Load districts when state changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedState && selectedState > 0) {
        try {
          const districtsData = await masterDataAPI.getDistricts(selectedState)
          setDistricts(districtsData || [])
          // Reset district selection when state changes
          setValue('district_id', 0)
        } catch (err) {
          console.error('Error loading districts:', err)
          setDistricts([])
        }
      } else {
        setDistricts([])
      }
    }
    loadDistricts()
  }, [selectedState, setValue])

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ['center_name']
        break
      case 2:
        fieldsToValidate = ['state_id', 'district_id']
        break
      case 3:
        fieldsToValidate = ['center_phone', 'center_pay_link']
        break
      default:
        return true
    }
    
    const result = await trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: OnboardingFormData) => {
    setError(null)
    setLoading(true)
    try {
      // Clean up optional fields - convert empty strings to undefined
      const cleanedData: CenterCreate = {
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

      const profile = await centerAPI.createProfile(cleanedData)
      
      // Update user in store with center_id
      if (user) {
        updateUser({ ...user, center_id: profile.center_id })
      }
      
      // Redirect to center dashboard
      navigate('/centre/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create center profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Center Profile
            </h1>
            <p className="text-gray-600">
              Please provide the following information to complete your center registration
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-start mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all relative z-10 ${
                        currentStep > step.number
                          ? 'bg-primary-600 text-white'
                          : currentStep === step.number
                          ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center ${
                      currentStep === step.number ? 'text-primary-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all ${
                        currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                      style={{ marginTop: '24px' }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Center Information</h2>
                  
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

                  <div className="grid md:grid-cols-2 gap-6">
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
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('state_id', { valueAsNumber: true })}
                      disabled={states.length === 1}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.state_id ? 'border-red-300' : 'border-gray-300'
                      } ${states.length === 1 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      {states.length === 0 ? (
                        <option value={0}>Loading states...</option>
                      ) : (
                        states.map((state) => (
                          <option key={state.state_id} value={state.state_id}>
                            {state.state_name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.state_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.state_id.message}</p>
                    )}
                    {states.length === 1 && (
                      <p className="mt-1 text-sm text-gray-500">Only Maharashtra is available</p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Center Address
                    </label>
                    <textarea
                      {...register('center_address')}
                      rows={4}
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
                </motion.div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                  
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

                  <div>
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

