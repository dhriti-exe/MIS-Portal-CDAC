import { useState, useEffect } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { applicantAPI, ApplicantCreate } from '../api/applicant'
import { masterDataAPI } from '../api/masterData'
import { useAuthStore } from '../store/authStore'

const onboardingSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(30, 'First name must be 30 characters or less'),
  middle_name: z.string().max(30, 'Middle name must be 30 characters or less').optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name must be 30 characters or less'),
  father_name: z.string().min(1, 'Father\'s name is required').max(50, 'Father\'s name must be 50 characters or less'),
  gender: z.enum(['M', 'F', 'O'], { required_error: 'Gender is required' }),
  dob: z.string().refine((date) => {
    const d = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - d.getFullYear()
    const monthDiff = today.getMonth() - d.getMonth()
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate()) ? age - 1 : age
    return actualAge >= 16 && actualAge <= 100
  }, 'Date of birth must be valid and age should be between 16 and 100 years'),
  caste_id: z.number().min(1, 'Please select a caste'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address must be 500 characters or less'),
  state_id: z.number().min(1, 'Please select a state'),
  district_id: z.number().min(1, 'Please select a district'),
  pin_code: z.number().min(100000, 'PIN code must be 6 digits').max(999999, 'PIN code must be 6 digits'),
  college_id: z.number().min(1, 'Please select a college'),
  other_college: z.string().max(60, 'Other college name must be 60 characters or less').optional().or(z.literal('')),
  mobile_no: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

export default function ApplicantOnboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [castes, setCastes] = useState<any[]>([])
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
  const selectedCollege = watch('college_id')

  // Load master data on mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoadingData(true)
        const [statesData, castesData] = await Promise.all([
          masterDataAPI.getStates(),
          masterDataAPI.getCastes(),
        ])
        // Filter to show only Maharashtra
        const maharashtraState = statesData.filter((state: any) => 
          state.state_name.toLowerCase().includes('maharashtra')
        )
        setStates(maharashtraState.length > 0 ? maharashtraState : statesData)
        setCastes(castesData)
        
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

  // Load dependent data when state changes
  useEffect(() => {
    const loadDependentData = async () => {
      if (selectedState && selectedState > 0) {
        try {
          setError(null)
          const [districtsData, collegesData] = await Promise.all([
            masterDataAPI.getDistricts(selectedState),
            masterDataAPI.getColleges(selectedState),
          ])
          setDistricts(districtsData || [])
          setColleges(collegesData || [])
          // Reset district and college when state changes
          setValue('district_id', 0)
          setValue('college_id', 0)
        } catch (err: any) {
          console.error('Error loading districts/colleges:', err)
          setError(err.response?.data?.detail || 'Failed to load districts and colleges. Please try again.')
          setDistricts([])
          setColleges([])
        }
      } else {
        setDistricts([])
        setColleges([])
      }
    }
    loadDependentData()
  }, [selectedState, setValue])

  // Validate current step before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ['first_name', 'middle_name', 'last_name', 'father_name', 'gender', 'dob', 'caste_id', 'mobile_no']
        break
      case 2:
        fieldsToValidate = ['address', 'state_id', 'district_id', 'pin_code']
        break
      case 3:
        fieldsToValidate = ['college_id']
        break
    }
    
    const result = await trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValidStep = await validateStep(currentStep)
    if (isValidStep) {
      setCurrentStep(currentStep + 1)
      setError(null)
    } else {
      setError('Please fill all required fields correctly before proceeding.')
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setError(null)
  }

  const onSubmit = async (data: OnboardingFormData) => {
    setError(null)
    setLoading(true)
    try {
      // Format date for API
      const profileData: ApplicantCreate = {
        ...data,
        email_id: user?.email || '',
        dob: data.dob, // Already in YYYY-MM-DD format from date input
        middle_name: data.middle_name || '', // Empty string if not provided
        other_college: data.other_college || undefined,
      }
      
      const profile = await applicantAPI.createProfile(profileData)
      updateUser({ applicant_id: profile.applicant_id })
      navigate('/applicant/dashboard')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create profile. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal Information', fields: ['first_name', 'middle_name', 'last_name', 'father_name', 'gender', 'dob', 'caste_id', 'mobile_no'] },
    { number: 2, title: 'Address Details', fields: ['address', 'state_id', 'district_id', 'pin_code'] },
    { number: 3, title: 'Education Details', fields: ['college_id', 'other_college'] },
  ]

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
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Please provide the following information to complete your registration
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
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('first_name')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                          errors.first_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                        maxLength={30}
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        {...register('middle_name')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                          errors.middle_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your middle name (optional)"
                        maxLength={30}
                      />
                      {errors.middle_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.middle_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('last_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.last_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                      maxLength={30}
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('father_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.father_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your father's name"
                      maxLength={50}
                    />
                    {errors.father_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.father_name.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('gender')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                          errors.gender ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('dob')}
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                          errors.dob ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.dob && (
                        <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caste <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('caste_id', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.caste_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value={0}>Select Caste</option>
                      {castes.map((caste) => (
                        <option key={caste.caste_id} value={caste.caste_id}>
                          {caste.caste_name}
                        </option>
                      ))}
                    </select>
                    {errors.caste_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.caste_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('mobile_no')}
                      type="tel"
                      maxLength={10}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.mobile_no ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="10 digit mobile number"
                    />
                    {errors.mobile_no && (
                      <p className="mt-1 text-sm text-red-600">{errors.mobile_no.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Address Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Address Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('address')}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none text-gray-900 ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your complete address (House/Flat No., Street, Area, etc.)"
                      maxLength={500}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

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
                      disabled={!selectedState || selectedState === 0}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.district_id ? 'border-red-300' : 'border-gray-300'
                      } ${!selectedState || selectedState === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value={0}>
                        {!selectedState || selectedState === 0 
                          ? 'Select State first' 
                          : districts.length === 0 
                          ? 'Loading districts...' 
                          : 'Select District'}
                      </option>
                      {districts.length > 0 ? (
                        districts.map((district) => (
                          <option key={district.district_id} value={district.district_id}>
                            {district.district_name}
                          </option>
                        ))
                      ) : selectedState && selectedState > 0 ? (
                        <option value={0} disabled>No districts available</option>
                      ) : null}
                    </select>
                    {errors.district_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.district_id.message}</p>
                    )}
                    {selectedState && selectedState > 0 && districts.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">No districts found for this state</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('pin_code', { 
                        valueAsNumber: true,
                        setValueAs: (value: string) => {
                          const num = parseInt(value.replace(/\D/g, ''), 10)
                          return isNaN(num) ? 0 : num
                        }
                      })}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.pin_code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="6 digit PIN code"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement
                        target.value = target.value.replace(/\D/g, '').slice(0, 6)
                      }}
                    />
                    {errors.pin_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.pin_code.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Education Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Education Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('college_id', { valueAsNumber: true })}
                      disabled={!selectedState || selectedState === 0}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.college_id ? 'border-red-300' : 'border-gray-300'
                      } ${!selectedState || selectedState === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value={0}>
                        {!selectedState || selectedState === 0 ? 'Select State first' : 'Select College'}
                      </option>
                      {colleges.map((college) => (
                        <option key={college.college_id} value={college.college_id}>
                          {college.college_name}
                        </option>
                      ))}
                    </select>
                    {errors.college_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.college_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other College (if not listed above)
                    </label>
                    <input
                      {...register('other_college')}
                      disabled={!!(selectedCollege && selectedCollege > 0)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 ${
                        errors.other_college ? 'border-red-300' : 'border-gray-300'
                      } ${selectedCollege && selectedCollege > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter college name if not in the list above"
                      maxLength={60}
                    />
                    {errors.other_college && (
                      <p className="mt-1 text-sm text-red-600">{errors.other_college.message}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Only fill this if your college is not in the dropdown list above
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    ← Previous
                  </button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-lg hover:shadow-xl"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Complete Registration ✓'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
