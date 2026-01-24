import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userRole, setRole } = useApp()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    setRole(null)
    localStorage.removeItem('userRole')
    navigate('/')
  }

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={userRole === 'committee' ? '/committee' : '/dashboard'} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <span className="material-symbols-outlined text-white text-xl">eco</span>
            </div>
            <span className="font-bold text-white text-lg">ESGChain</span>
          </Link>

          {/* Navigation Links - Committee */}
          {userRole === 'committee' && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/committee"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/committee')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Submit Data
              </Link>
              <Link
                to="/committee/history"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/committee/history')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                My Submissions
              </Link>
            </div>
          )}

          {/* Navigation Links - User */}
          {userRole === 'user' && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                View Companies
              </Link>
              <Link
                to="/history"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/history')
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                All Submissions
              </Link>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              userRole === 'committee'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                : 'bg-blue-500/20 text-blue-300 border-blue-400/50'
            }`}>
              {userRole === 'committee' ? '✓ Committee' : '👁️ Public User'}
            </div>

            <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-blue-200 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
