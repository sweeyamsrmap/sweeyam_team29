import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import RoleSelection from './pages/RoleSelection'
import UserDashboard from './pages/UserDashboard'
import CommitteeDashboard from './pages/CommitteeDashboard'
import AdminVerification from './pages/AdminVerification'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Submit from './pages/Submit'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/committee" element={<CommitteeDashboard />} />
            <Route path="/admin" element={<AdminVerification />} />
            <Route path="/dashboard" element={
              <>
                <Navbar />
                <Dashboard />
              </>
            } />
            <Route path="/history" element={
              <>
                <Navbar />
                <History />
              </>
            } />
            <Route path="/submit" element={
              <>
                <Navbar />
                <Submit />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
