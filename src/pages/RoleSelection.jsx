import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function RoleSelection() {
  const navigate = useNavigate()
  const { setRole } = useApp()

  const handleRoleSelect = (role, path) => {
    setRole(role)
    localStorage.setItem('userRole', role)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl shadow-blue-500/50">
            <span className="text-white text-3xl sm:text-4xl font-bold">E</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-3">ESGChain</h1>
          <p className="text-base sm:text-xl text-blue-200 px-4">Blockchain-Powered ESG Verification</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-2 sm:px-0">
          {/* User Dashboard */}
          <button
            onClick={() => handleRoleSelect('user', '/user')}
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-8 border-2 border-white/20 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/30 transition-all group text-left active:scale-[0.98] sm:hover:scale-[1.02]"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <span className="material-symbols-outlined text-white text-3xl sm:text-4xl">person</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">User Dashboard</h2>
            <p className="text-blue-200 mb-4 sm:mb-6 text-sm sm:text-lg">View and verify ESG data from companies</p>
            <ul className="text-blue-100 space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                View all company ESG reports
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                Verify data on blockchain
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                Track emissions across industries
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                Download verification certificates
              </li>
            </ul>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-blue-400 group-hover:text-blue-300">
              <span className="text-sm sm:text-base">Enter Dashboard</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>

          {/* Committee Dashboard */}
          <button
            onClick={() => handleRoleSelect('committee', '/committee')}
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-8 border-2 border-white/20 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all group text-left active:scale-[0.98] sm:hover:scale-[1.02]"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
              <span className="material-symbols-outlined text-white text-3xl sm:text-4xl">groups</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Committee Portal</h2>
            <p className="text-blue-200 mb-4 sm:mb-6 text-sm sm:text-lg">Submit and manage ESG data for companies</p>
            <ul className="text-blue-100 space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                Submit ESG reports to blockchain
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                Quick submission modal
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                Track your submissions
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                View all recorded data
              </li>
            </ul>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-emerald-400 group-hover:text-emerald-300">
              <span className="text-sm sm:text-base">Enter Committee Portal</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => handleRoleSelect('admin', '/admin')}
            className="text-blue-300 hover:text-white text-xs sm:text-sm flex items-center gap-2 mx-auto hover:bg-white/10 px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Admin Panel
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-blue-300 text-xs sm:text-base">
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="material-symbols-outlined text-xs sm:text-sm">lock</span> Secure
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="material-symbols-outlined text-xs sm:text-sm">visibility</span> Transparent
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="material-symbols-outlined text-xs sm:text-sm">verified</span> Immutable
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
