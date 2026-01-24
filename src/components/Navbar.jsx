import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">ESGChain</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
