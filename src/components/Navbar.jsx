import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <span className="text-white text-xl font-black italic">E</span>
            </div>
            <span className="font-black text-white text-lg tracking-tighter">ESGChain</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {[
              { path: '/dashboard', label: 'Dashboard', icon: 'analytics' },
              { path: '/submit', label: 'Submit', icon: 'upload_file' },
              { path: '/history', label: 'History', icon: 'history' },
              { path: '/admin', label: 'Admin', icon: 'shield_person' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
