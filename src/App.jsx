import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AdminVerification from './pages/AdminVerification'
import RoleSelection from './pages/RoleSelection'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/admin" element={<AdminVerification />} />
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
