import { FileText, Calendar, Newspaper, User, Bell, LogOut } from 'lucide-react'
import { ApplicantProfile } from '../../api/applicant'

export type DashboardSection = 'applications' | 'sessions' | 'news' | 'profile' | 'notifications'

interface DashboardSidebarProps {
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
  onLogout: () => void
  profile: ApplicantProfile | null
}

const mainMenuItems: Array<{ id: DashboardSection; label: string; icon: typeof FileText }> = [
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'sessions', label: 'Training Sessions', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'news', label: 'Latest News', icon: Newspaper },
  { id: 'profile', label: 'My Profile', icon: User },
]

export default function DashboardSidebar({
  activeSection,
  onSectionChange,
  onLogout,
  profile,
}: DashboardSidebarProps) {
  const getUserName = () => {
    if (profile) {
      const name = `${profile.first_name} ${profile.middle_name || ''} ${profile.last_name}`.trim()
      return name || 'User'
    }
    return 'User'
  }

  const profilePhotoUrl = profile?.profile_photo || null

  return (
    <div className="w-64 bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 h-full lg:h-fit lg:sticky lg:top-24 overflow-y-auto">
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="relative flex-shrink-0">
            {profilePhotoUrl ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-primary-200">
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{getUserName()}</p>
            <p className="text-xs text-gray-500">Applicant</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="space-y-1">
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all text-left active:scale-95 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
              }`}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
              <span className="text-xs sm:text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all active:bg-red-100 active:scale-95"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

