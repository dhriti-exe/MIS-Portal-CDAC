import { useAuthStore } from '../store/authStore'

export default function AdminDashboard() {
  const { user, clearAuth } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">Admin Dashboard</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, Administrator!</h2>
          <p className="text-gray-600 mb-8">
            Manage the entire system: master data, users, centres, and system-wide configurations.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Master Data</h3>
              <p className="text-gray-600 mb-4">Manage states, districts, colleges, and other master data</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                Manage Data →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Centres</h3>
              <p className="text-gray-600 mb-4">Manage training centres and their configurations</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                Manage Centres →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Users</h3>
              <p className="text-gray-600 mb-4">View and manage all system users</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">
                Manage Users →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

