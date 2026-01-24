import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import RoleSelection from './pages/RoleSelection'
import VerificationHistory from './pages/VerificationHistory'
import NewEntry from './pages/NewEntry'
import FloatingLines from './components/FloatingLines'

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { userRole } = useApp()

  if (!userRole) {
    return <Navigate to="/" replace />
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'committee' ? '/committee' : '/dashboard'} replace />
  }

  return children
}

// Layout with Navbar and Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                <span className="material-symbols-outlined text-white text-xl">eco</span>
              </div>
              <span className="font-bold text-white">ESGChain © 2024</span>
            </div>
            <div className="flex gap-8 text-sm text-blue-200">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security Audit</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function AppRoutes() {
  const { userRole } = useApp()

  return (
    <Routes>
      <Route path="/" element={userRole ? <Navigate to={userRole === 'committee' ? '/committee' : '/dashboard'} replace /> : <RoleSelection />} />

      {/* Committee Routes - Submit Data */}
      <Route path="/committee" element={
        <ProtectedRoute allowedRole="committee">
          <Layout>
            <NewEntry />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/committee/history" element={
        <ProtectedRoute allowedRole="committee">
          <Layout>
            <VerificationHistory />
          </Layout>
        </ProtectedRoute>
      } />

      {/* User Routes - View Only */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="user">
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute allowedRole="user">
          <Layout>
            <VerificationHistory />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all - redirect based on role */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative">
          {/* Animated Background */}
          <div className="fixed inset-0 z-0">
            <FloatingLines
              enabledWaves={["top","middle","bottom"]}
              lineCount={5}
              lineDistance={5}
              bendRadius={5}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
              linesGradient={['#3b82f6', '#06b6d4', '#10b981', '#3b82f6']}
              animationSpeed={0.8}
              mixBlendMode="screen"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <AppRoutes />
          </div>
        </div>
      </AppProvider>
    </Router>
  )
}

export default App
