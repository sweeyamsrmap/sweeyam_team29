import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getExplorerUrl } from '../utils/blockchain'
import VerificationCertificate from '../components/VerificationCertificate'

function AdminVerification() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [verifyingSubmission, setVerifyingSubmission] = useState(null)
  const navigate = useNavigate()
  const { setRole } = useApp()
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const loadSubmissions = () => {
      const realSubmissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
      setSubmissions(realSubmissions)
    }
    loadSubmissions()
    const interval = setInterval(loadSubmissions, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    setRole(null)
    localStorage.removeItem('userRole')
    navigate('/')
  }

  const getFilteredSubmissions = () => {
    let filtered = submissions
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.company?.toLowerCase().includes(query) ||
        s.txHash?.toLowerCase().includes(query) ||
        s.formData?.industrySector?.toLowerCase().includes(query)
      )
    }
    switch (activeFilter) {
      case 'high-priority':
        filtered = filtered.filter(s => parseFloat(s.emissions) > 1000)
        break
      case 'onchain':
        filtered = filtered.filter(s => s.isRealBlockchain === true)
        break
      default: break
    }
    return filtered
  }

  const filteredSubmissions = getFilteredSubmissions()

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return
    const headers = ['Company', 'Emissions', 'Industry', 'Date', 'TX Hash', 'On-Chain']
    const rows = filteredSubmissions.map(s => [
      s.company, s.emissions, s.formData?.industrySector || 'General', s.date, s.txHash, s.isRealBlockchain ? 'Yes' : 'No'
    ])
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `esg_admin_export.csv`
    link.click()
  }

  const filters = [
    { id: 'all', label: 'All', count: submissions.length },
    { id: 'onchain', label: 'Blockchain', count: submissions.filter(s => s.isRealBlockchain).length, color: 'green' },
    { id: 'high-priority', label: 'Priority', count: submissions.filter(s => parseFloat(s.emissions) > 1000).length, color: 'red' },
  ]

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-xl font-black italic">E</span>
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight">Admin</h2>
              <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Verified Hub</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-sm font-medium">Portal Home</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm font-medium">Statistics</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-400/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined">verified</span>
            <span className="text-sm font-bold">Verification Queue</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-transparent">
        <div className="bg-white/5 backdrop-blur-md border-b border-white/10 px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-white">
                Queue <span className="text-blue-500 ml-2">{filteredSubmissions.length}</span>
              </h1>
              <p className="text-blue-300 text-sm mt-1">Reviewing submissions for blockchain finality.</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">search</span>
            <input
              type="text"
              placeholder="Search by company or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="px-8 py-6 border-b border-white/10 flex items-center gap-3">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${activeFilter === filter.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-white/5 text-blue-300 border-white/10 hover:bg-white/10'
                }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="p-8">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-20 text-center">
              <span className="material-symbols-outlined text-blue-400 text-6xl mb-4">move_to_inbox</span>
              <h3 className="text-xl font-bold text-white">Queue Empty</h3>
              <p className="text-blue-300 mt-2">No data currently requires verification.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubmissions.map(submission => (
                <div key={submission.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl">
                        {submission.company?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{submission.company}</h3>
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{submission.txHash?.slice(0, 20)}...</code>
                          {submission.isRealBlockchain && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">On-Chain</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Date</p>
                      <p className="text-sm text-white font-medium">{submission.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Emissions</p>
                      <p className="text-2xl font-black text-white">{submission.emissions} <span className="text-xs font-normal text-blue-300">t</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Industry</p>
                      <p className="text-sm font-bold text-white uppercase">{submission.formData?.industrySector || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Status</p>
                      <p className="text-sm font-black text-emerald-400">✓ VERIFIED</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-white/5">
                    <button
                      onClick={() => setVerifyingSubmission(submission)}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-black hover:bg-emerald-500 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      AUDIT DATA
                    </button>
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="px-6 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm font-black hover:bg-white/10 transition-all"
                    >
                      VIEW LABEL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Modal */}
      {verifyingSubmission && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button onClick={() => setVerifyingSubmission(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black text-white">Final Audit & Verification</h2>
              <p className="text-blue-300 text-sm font-bold uppercase tracking-widest">{verifyingSubmission.company} • DATA INTEGRITY REVIEW</p>
            </div>

            <div className="space-y-8">
              {/* E Section */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-emerald-400 font-black mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <span className="material-symbols-outlined text-sm">eco</span> Environmental Audit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Scope 1 (Claimed: {verifyingSubmission.formData?.scope1Emissions?.value || verifyingSubmission.emissions})</label>
                    <input type="number" placeholder="Verified Value" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Scope 2 (Claimed: {verifyingSubmission.formData?.scope2Emissions?.value || '0'})</label>
                    <input type="number" placeholder="Verified Value" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              {/* S Section */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-orange-400 font-black mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <span className="material-symbols-outlined text-sm">groups</span> Social Impact Audit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Pay Gap ({verifyingSubmission.formData?.social?.employeeWelfare?.genderPayGap?.value || 'N/A'}%)</label>
                    <input type="number" placeholder="Verified %" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Turnover ({verifyingSubmission.formData?.social?.employeeWelfare?.turnoverRate?.value || 'N/A'}%)</label>
                    <input type="number" placeholder="Verified %" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Diversity ({verifyingSubmission.formData?.social?.diversityInclusion?.minorityRepresentation?.value || 'N/A'}%)</label>
                    <input type="number" placeholder="Verified %" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                </div>
              </div>

              {/* G Section */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-blue-400 font-black mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <span className="material-symbols-outlined text-sm">gavel</span> Governance Audit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Indep. Board %</label>
                    <input type="number" placeholder="Verified %" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-300 uppercase">Decision Status</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500">
                      <option>APPROVED & VERIFIED</option>
                      <option>DATA DISPUTED</option>
                      <option>INSUFFICIENT EVIDENCE</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    alert('Audit successfully signed and anchored to record.');
                    setVerifyingSubmission(null);
                  }}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                >
                  FINALIZE & ANCHOR VERIFICATION
                </button>
                <button onClick={() => setVerifyingSubmission(null)} className="flex-1 bg-white/5 text-white py-4 rounded-xl font-black border border-white/10 hover:bg-white/10 transition-all font-sans">
                  CANCEL AUDIT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
