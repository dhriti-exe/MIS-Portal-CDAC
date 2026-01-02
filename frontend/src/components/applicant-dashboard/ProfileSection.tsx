import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Camera } from 'lucide-react'
import { ApplicantProfile } from '../../api/applicant'
import { masterDataAPI } from '../../api/masterData'

interface ProfileSectionProps {
  profile: ApplicantProfile | null
  onPhotoUpload: (file: File) => Promise<void>
}

export default function ProfileSection({ profile, onPhotoUpload }: ProfileSectionProps) {
  const [uploading, setUploading] = useState(false)
  const [casteName, setCasteName] = useState<string>('')
  const [stateName, setStateName] = useState<string>('')
  const [districtName, setDistrictName] = useState<string>('')
  const [collegeName, setCollegeName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      loadMasterData()
    }
  }, [profile])

  const loadMasterData = async () => {
    if (!profile) return
    try {
      const [castes, states, districts, colleges] = await Promise.all([
        masterDataAPI.getCastes().catch(() => []),
        masterDataAPI.getStates().catch(() => []),
        masterDataAPI.getDistricts(profile.state_id).catch(() => []),
        masterDataAPI.getColleges(profile.state_id).catch(() => []),
      ])
      const caste = castes.find((c) => c.caste_id === profile.caste_id)
      const state = states.find((s) => s.state_id === profile.state_id)
      const district = districts.find((d) => d.district_id === profile.district_id)
      const college = colleges.find((c) => c.college_id === profile.college_id)

      if (caste) setCasteName(caste.caste_name)
      if (state) setStateName(state.state_name)
      if (district) setDistrictName(district.district_name)
      if (college) setCollegeName(college.college_name)
    } catch (err) {
      console.error('Error loading master data:', err)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    try {
      setUploading(true)
      await onPhotoUpload(file)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Profile not found. Please complete onboarding.</p>
        </div>
      </div>
    )
  }

  // Profile photo URL - can be Cloudinary URL or local path
  const profilePhotoUrl = profile.profile_photo || null

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-primary-200 shadow-md">
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 p-1.5 sm:p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:bg-primary-800"
                title="Change profile picture"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {profile.first_name} {profile.middle_name || ''} {profile.last_name}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Applicant Profile</p>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-gray-700">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Uploading profile picture...</span>
          </div>
        )}
      </div>

      {/* Profile Details Section */}
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

        {/* Personal Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 sm:h-6 bg-primary-600 rounded"></div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{profile.first_name}</p>
            </div>
            {profile.middle_name && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Middle Name</label>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{profile.middle_name}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{profile.last_name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Father's Name</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{profile.father_name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
              <p className="text-sm sm:text-base font-medium text-gray-900">
                {profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
              <p className="text-sm sm:text-base font-medium text-gray-900">
                {new Date(profile.dob).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Caste</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{casteName || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 sm:h-6 bg-primary-600 rounded"></div>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-all">{profile.email_id}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</label>
              <p className="text-sm sm:text-base font-medium text-gray-900">{profile.mobile_no}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 sm:h-6 bg-primary-600 rounded"></div>
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Complete Address</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed break-words">{profile.address}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{stateName || 'Loading...'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">District</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{districtName || 'Loading...'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PIN Code</label>
              <p className="text-sm sm:text-base font-medium text-gray-900">{profile.pin_code}</p>
            </div>
          </div>
        </div>

        {/* Education Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 sm:h-6 bg-primary-600 rounded"></div>
            Education Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">College</label>
              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                {profile.other_college || collegeName || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

