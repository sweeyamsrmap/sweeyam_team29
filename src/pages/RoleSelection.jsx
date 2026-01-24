import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function RoleSelection() {
  const navigate = useNavigate()
  const { setRole } = useApp()

  const handleRoleSelection = (role) => {
    setRole(role)
    navigate(role === 'committee' ? '/committee' : '/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-white text-3xl font-bold">E</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">ESG Verification Platform</h1>
          <p className="text-blue-200">Blockchain-based ESG Data Collection & Verification</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelection('committee')}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all group"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
              <span className="material-symbols-outlined text-4xl text-emerald-400 group-hover:text-white transition-colors">verified_user</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Committee Member</h2>
            <p className="text-blue-200 mb-4">Collect and submit verified ESG data to blockchain</p>
            <ul className="text-left text-sm text-blue-300 space-y-2">
              <li>✓ Visit companies and collect data</li>
              <li>✓ Verify ESG compliance on-site</li>
              <li>✓ Submit verified data to blockchain</li>
              <li>✓ Prevent greenwashing</li>
            </ul>
          </button>

          <button
            onClick={() => handleRoleSelection('user')}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <span className="material-symbols-outlined text-4xl text-blue-400 group-hover:text-white transition-colors">search</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Public User</h2>
            <p className="text-blue-200 mb-4">View and verify company ESG compliance</p>
            <ul className="text-left text-sm text-blue-300 space-y-2">
              <li>✓ View all verified ESG data</li>
              <li>✓ Check company compliance</li>
              <li>✓ Verify on blockchain</li>
              <li>✓ Download certificates</li>
            </ul>
          </button>
        </div>

        <div className="text-center mt-8 text-sm text-blue-300">
          <p>🔒 Secure • 🌐 Transparent • ⛓️ Immutable</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
