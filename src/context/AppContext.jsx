import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile')
    return saved ? JSON.parse(saved) : null
  })
  const [submissions, setSubmissions] = useState([])
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [verifications, setVerifications] = useState([])
  const [recentProof, setRecentProof] = useState(null)
  const [stats, setStats] = useState({
    totalFacilities: 42,
    activeOracles: 128,
    avgGridIntensity: 245,
    carbonOffsetCredit: 12450,
    totalVerified: 2400000
  })

  const setRole = (role) => {
    setUserRole(role)
    localStorage.setItem('userRole', role)
  }

  const updateProfile = (profile) => {
    setUserProfile(profile)
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  const addSubmission = (submission) => {
    // Add to pending if user is company, approved if admin
    if (userRole === 'company') {
      const pendingSubmission = {
        ...submission,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: userProfile?.companyName || 'Unknown'
      }
      setPendingSubmissions(prev => [pendingSubmission, ...prev])
    } else {
      setSubmissions(prev => [submission, ...prev])
      setRecentProof(submission)
    }
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalVerified: prev.totalVerified + parseFloat(submission.data.emissions || 0)
    }))
  }

  const approveSubmission = (submission, adminName) => {
    // Remove from pending
    setPendingSubmissions(prev => prev.filter(s => s.transactionHash !== submission.transactionHash))
    
    // Add to approved submissions
    const approvedSubmission = {
      ...submission,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: adminName,
      verificationNotes: 'Data verified and approved for blockchain submission'
    }
    setSubmissions(prev => [approvedSubmission, ...prev])
    setRecentProof(approvedSubmission)
  }

  const rejectSubmission = (submission, reason, adminName) => {
    // Remove from pending
    setPendingSubmissions(prev => prev.filter(s => s.transactionHash !== submission.transactionHash))
    
    // Add to rejected list (could be separate state if needed)
    const rejectedSubmission = {
      ...submission,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: adminName,
      rejectionReason: reason
    }
    // For now, just remove it. In production, you'd store rejected submissions
    console.log('Rejected:', rejectedSubmission)
  }

  const addVerification = (verification) => {
    setVerifications(prev => [verification, ...prev])
  }

  return (
    <AppContext.Provider value={{
      userRole,
      userProfile,
      setRole,
      updateProfile,
      submissions,
      pendingSubmissions,
      verifications,
      recentProof,
      stats,
      addSubmission,
      approveSubmission,
      rejectSubmission,
      addVerification,
      setRecentProof
    }}>
      {children}
    </AppContext.Provider>
  )
}
