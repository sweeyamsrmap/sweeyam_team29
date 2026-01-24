import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getExplorerUrl } from '../utils/blockchain'
import VerificationCertificate from '../components/VerificationCertificate'

function AdminVerification() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const navigate = useNavigate()
  const { setRole } = useApp()
  const [submissions, setSubmissions] = useState([])

  // Load real submissions from localStorage
  useEffect(() => {
    const loadSubmissions = () => {
      const realSubmissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
      setSubmissions(realSubmissions)
    }

    loadSubmissions()

    // Reload when storage changes
    const interval = setInterval(loadSubmissions, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    setRole(null)
    localStorage.removeItem('userRole')
    navigate('/')
  }

  // Filter submissions based on active filter and search query
  const getFilteredSubmissions = () => {
    let filtered = submissions

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.company?.toLowerCase().includes(query) ||
        s.txHash?.toLowerCase().includes(query) ||
        s.formData?.industrySector?.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    switch (activeFilter) {
      case 'high-priority':
        filtered = filtered.filter(s => parseFloat(s.emissions) > 1000)
        break
      case 'renewable':
        filtered = filtered.filter(s =>
          s.formData?.industrySector?.toLowerCase().includes('energy') ||
          s.formData?.industrySector?.toLowerCase().includes('renewable')
        )
        break
      case 'industrial':
        filtered = filtered.filter(s =>
          s.formData?.industrySector?.toLowerCase().includes('manufacturing') ||
          s.formData?.industrySector?.toLowerCase().includes('industrial')
        )
        break
      case 'recent':
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        filtered = filtered.filter(s => new Date(s.date) > dayAgo)
        break
      case 'onchain':
        filtered = filtered.filter(s => s.isRealBlockchain === true)
        break
      default:
        break
    }

    return filtered
  }

  const filteredSubmissions = getFilteredSubmissions()

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('No submissions to export')
      return
    }

    const headers = ['Company', 'Emissions (tonnes CO2e)', 'Industry Sector', 'Submission Date', 'Transaction Hash', 'Block Number', 'On-Chain', 'Status']
    const rows = filteredSubmissions.map(s => [
      s.company,
      s.emissions,
      s.formData?.industrySector || 'General',
      s.date,
      s.txHash,
      s.blockNumber,
      s.isRealBlockchain ? 'Yes' : 'No',
      s.status || 'approved'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `esg_submissions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const filters = [
    { id: 'all', label: 'All Submissions', count: submissions.length },
    { id: 'onchain', label: 'On-Chain', count: submissions.filter(s => s.isRealBlockchain).length, color: 'green' },
    { id: 'high-priority', label: 'High Priority', count: submissions.filter(s => parseFloat(s.emissions) > 1000).length, color: 'red' },
    { id: 'renewable', label: 'Renewable Energy', count: submissions.filter(s => s.formData?.industrySector?.toLowerCase().includes('energy')).length },
    { id: 'industrial', label: 'Industrial', count: submissions.filter(s => s.formData?.industrySector?.toLowerCase().includes('manufacturing')).length },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900">ESG Ledger</h2>
              <p className="text-xs text-slate-500">ADMIN PORTAL</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg mb-1">
            <span className="material-symbols-outlined">verified</span>
            <span>Verification Queue</span>
          </Link>
          <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
            <span className="material-symbols-outlined">history</span>
            <span>History</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Alex Chen</p>
              <p className="text-xs text-slate-500">SUPER ADMIN</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Pending Review <span className="text-blue-600 text-xl">{filteredSubmissions.length} REPORTS</span>
              </h1>
              <p className="text-slate-600 mt-1">Review and verify ESG data submissions for blockchain ledger entry.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export CSV
              </button>
            </div>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search transactions, companies, or hash IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {filter.color === 'red' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
                {filter.color === 'green' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                {filter.label}
                <span className="ml-2 text-xs opacity-70">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">inbox</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Submissions Found</h3>
              <p className="text-slate-600 mb-4">
                {searchQuery || activeFilter !== 'all'
                  ? 'No records match your current filters.'
                  : 'Waiting for companies to submit their ESG data to the blockchain.'}
              </p>
              {(searchQuery || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveFilter('all')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map(submission => {
                const logo = submission.company.charAt(0).toUpperCase()
                const isHighPriority = parseFloat(submission.emissions) > 1000
                const isReal = submission.isRealBlockchain
                const logoColors = ['bg-emerald-600', 'bg-teal-600', 'bg-blue-600', 'bg-purple-600', 'bg-orange-600']
                const logoColor = logoColors[submission.id % logoColors.length]

                return (
                  <div key={submission.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 ${logoColor} rounded-xl flex items-center justify-center text-white font-bold text-2xl`}>
                          {logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">{submission.company}</h3>
                            {isReal && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                ON-CHAIN
                              </span>
                            )}
                            {isHighPriority && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                HIGH PRIORITY
                              </span>
                            )}
                            {!isHighPriority && !isReal && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                VERIFIED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            <code className="text-xs">{submission.txHash?.slice(0, 30)}...</code>
                            {isReal && (
                              <a
                                href={getExplorerUrl(submission.txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                                title="View on Etherscan"
                              >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">SUBMISSION DATE</p>
                        <p className="text-sm font-semibold text-slate-900">{submission.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-2">NET EMISSIONS</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {parseFloat(submission.emissions).toLocaleString()}{' '}
                          <span className="text-sm font-normal text-slate-500">tonnes CO2e</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">INDUSTRY SECTOR</p>
                        <p className="text-sm font-medium text-slate-700">
                          {submission.formData?.industrySector || 'General'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Reporting Year: {submission.formData?.reportingYear || '2024'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">BLOCKCHAIN STATUS</p>
                        <p className="text-lg font-bold text-green-600">
                          ✓ {isReal ? 'Verified on Sepolia' : 'Verified'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Block: {submission.blockNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex gap-3">
                        {isReal && (
                          <a
                            href={getExplorerUrl(submission.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                            View on Etherscan
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className={`flex items-center gap-2 px-4 py-2 ${isReal ? 'text-slate-600 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700'} rounded-lg text-sm font-medium transition-colors`}
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View Details
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <span className="px-6 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                          ✓ Approved
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filteredSubmissions.length > 0 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold">1-{filteredSubmissions.length}</span> of{' '}
                <span className="font-semibold">{filteredSubmissions.length}</span> submissions
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">1</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedSubmission && (
        <VerificationCertificate
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
}

export default AdminVerification
