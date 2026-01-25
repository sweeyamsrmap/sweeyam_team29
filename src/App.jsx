import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/Navbar'
import Onboarding from './components/Onboarding'
import InteractiveBackground from './components/InteractiveBackground'
import RoleSelection from './pages/RoleSelection'
import UserDashboard from './pages/UserDashboard'
import CommitteeDashboard from './pages/CommitteeDashboard'
import AdminVerification from './pages/AdminVerification'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Submit from './pages/Submit'
import Drafts from './pages/Drafts'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboarding_complete')
    if (!onboardingComplete) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  // Reset onboarding for testing (can be triggered via console: resetOnboarding())
  useEffect(() => {
    window.resetOnboarding = () => {
      localStorage.removeItem('onboarding_complete')
      setShowOnboarding(true)
    }
  }, [])

  return (
    <AppProvider>
      <NotificationProvider>
        <InteractiveBackground />
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        <Router>
          <div className="min-h-screen bg-transparent relative">
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
              <Route path="/drafts" element={
                <>
                  <Navbar />
                  <Drafts />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AppProvider>
  )
}

export default App
