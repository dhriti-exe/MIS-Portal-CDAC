import { Building2, Calendar, Users, Newspaper, User, LogOut } from 'lucide-react'
import { CenterProfile } from '../../api/center'

export type CentreSection = 'sessions' | 'applications' | 'news' | 'profile'

interface CentreSidebarProps {
  activeSection: CentreSection
  onSectionChange: (section: CentreSection) => void
  onLogout: () => void
  profile: CenterProfile | null
}

const mainMenuItems: Array<{ id: CentreSection; label: string; icon: typeof Calendar }> = [
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function CentreSidebar({
  activeSection,
  onSectionChange,
  onLogout,
  profile,
}: CentreSidebarProps) {
  const getCenterName = () => {
    return profile?.center_name || 'Training Centre'
  }

  return (
    <div className="w-64 bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 h-full lg:h-fit lg:sticky lg:top-24 overflow-y-auto">
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{getCenterName()}</p>
            <p className="text-xs text-gray-500">Centre Admin</p>
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
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
              }`}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
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
