import { useAuthStore } from '../store/authStore'

export default function CentreDashboard() {
  const { user, clearAuth } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">Centre Dashboard</h1>
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={clearAuth}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, Centre Admin!</h2>
          <p className="text-gray-600 mb-8">
            Manage your training centre, create sessions, publish enrollment notices, and review applications.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sessions</h3>
              <p className="text-gray-600 mb-4">Create and manage training sessions</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                Manage Sessions →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enrollments</h3>
              <p className="text-gray-600 mb-4">Publish and manage enrollment notices</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                Manage Enrollments →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Applications</h3>
              <p className="text-gray-600 mb-4">Review and process applications</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                View Applications →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

