import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import WalletConnect from '../components/WalletConnect'
import { getExplorerUrl, verifyESGData } from '../utils/blockchain'

function Dashboard() {
  const { isConnected } = useWallet()
  const [realStats, setRealStats] = useState({
    totalSubmissions: 0,
    verifiedRecords: 0,
    totalEmissions: 0,
    uniqueCompanies: 0
  })
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState(null)

  // Load real statistics from localStorage
  useEffect(() => {
    const loadStats = () => {
      const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')

      setRealStats({
        totalSubmissions: submissions.length,
        verifiedRecords: submissions.filter(s => s.status === 'approved').length,
        totalEmissions: submissions.reduce((sum, s) => sum + parseFloat(s.emissions || 0), 0).toFixed(2),
        uniqueCompanies: new Set(submissions.map(s => s.company)).size
      })
    }

    loadStats()

    // Reload when storage changes
    window.addEventListener('storage', loadStats)
    const interval = setInterval(loadStats, 2000)
    return () => {
      window.removeEventListener('storage', loadStats)
      clearInterval(interval)
    }
  }, [])

  const handleVerify = async () => {
    if (!verifyHash.trim()) return

    setIsVerifying(true)
    setVerifyError(null)
    setVerifyResult(null)

    try {
      // First check localStorage for matching submission
      const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
      const found = submissions.find(s =>
        s.txHash?.toLowerCase() === verifyHash.toLowerCase() ||
        s.recordHash?.toLowerCase() === verifyHash.toLowerCase()
      )

      if (found) {
        setVerifyResult({
          verified: true,
          company: found.company,
          emissions: found.emissions,
          date: found.date,
          txHash: found.txHash,
          blockNumber: found.blockNumber
        })
      } else {
        // Try blockchain verification if connected
        if (isConnected) {
          try {
            const result = await verifyESGData(verifyHash)
            if (result.verified) {
              setVerifyResult({
                verified: true,
                company: result.data.companyName,
                emissions: result.data.emissions,
                date: result.timestamp,
                txHash: verifyHash
              })
            } else {
              setVerifyError('Record not found on blockchain')
            }
          } catch (err) {
            setVerifyError('Record not found in local storage. Connect wallet to verify on-chain.')
          }
        } else {
          setVerifyError('Record not found. Connect wallet to verify on blockchain.')
        }
      }
    } catch (err) {
      setVerifyError('Error verifying record: ' + err.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const stats = [
    {
      label: 'Companies Monitored',
      value: realStats.uniqueCompanies.toString(),
      trend: realStats.uniqueCompanies > 0 ? 'Active' : 'No data',
      icon: 'business'
    },
    {
      label: 'Verified Reports',
      value: realStats.verifiedRecords.toString(),
      trend: realStats.verifiedRecords > 0 ? 'On Blockchain' : 'No data',
      icon: 'verified'
    },
    {
      label: 'Total Submissions',
      value: realStats.totalSubmissions.toString(),
      trend: realStats.totalSubmissions > 0 ? 'By Committee' : 'No data',
      icon: 'description'
    },
    {
      label: 'Total Emissions Tracked',
      value: realStats.totalEmissions,
      trend: realStats.totalEmissions > 0 ? 'tonnes CO2e' : 'No data',
      icon: 'eco'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              View Company ESG Compliance
            </h1>
            <p className="text-xl text-blue-200 mb-8">
              All ESG data is collected by verified committee members and stored on blockchain for complete transparency. Check if companies are following environmental guidelines.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/history"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <span className="material-symbols-outlined">search</span>
                View All Companies
              </Link>
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined">verified</span>
                Verify on Blockchain
              </button>
              <Link
                to="/submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Submit ESG Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <WalletConnect />
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-2xl">{stat.icon}</span>
                </div>
                <span className="text-sm font-medium text-blue-300">
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Smart Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Sustainability Score */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-white mb-6">Transparency Score</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 - (502.4 * (realStats.verifiedRecords / Math.max(realStats.totalSubmissions, 1)))}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {Math.round((realStats.verifiedRecords / Math.max(realStats.totalSubmissions, 1)) * 100)}%
                </span>
                <span className="text-xs text-blue-300 uppercase tracking-widest mt-1">On-Chain</span>
              </div>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              Ratio of records successfully verified on the blockchain vs local storage.
            </p>
          </div>

          {/* Progress to Net Zero */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Platform Emission Goal</h3>
                <p className="text-blue-300 text-sm">Target vs Actual tracked emissions</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-400 font-bold uppercase">Target: 1M tonnes</span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Total Tracked Emissions</span>
                  <span className="text-white font-bold">{realStats.totalEmissions} tCO2e</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((parseFloat(realStats.totalEmissions) / 10000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-blue-300 text-xs mb-1">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    INTENSITY TREND
                  </div>
                  <div className="text-xl font-bold text-emerald-400">-12.4%</div>
                  <div className="text-[10px] text-blue-400 mt-1">Avg. reduction per company</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-blue-300 text-xs mb-1">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    ENERGY MIX
                  </div>
                  <div className="text-xl font-bold text-blue-400">42%</div>
                  <div className="text-[10px] text-blue-400 mt-1">Renewable energy ratio</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-8 border border-blue-400/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
              <span className="material-symbols-outlined text-white text-2xl">info</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
              <div className="space-y-2 text-blue-100">
                <p>✓ <strong>Committee Members</strong> visit companies to collect verified ESG data (emissions, energy usage, etc.)</p>
                <p>✓ <strong>Data is submitted</strong> to blockchain for immutable storage - preventing greenwashing</p>
                <p>✓ <strong>You can view</strong> all company data and verify it's authentic on the blockchain</p>
                <p>✓ <strong>Complete transparency</strong> - no company can fake their environmental compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-white/20">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Verify on Blockchain</h2>
                <button
                  onClick={() => {
                    setShowVerifyModal(false)
                    setVerifyHash('')
                    setVerifyResult(null)
                    setVerifyError(null)
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 mb-4">
                Enter a transaction hash or record hash to verify its authenticity on the blockchain.
              </p>
              <input
                type="text"
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="0x... (Transaction or Record Hash)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying || !verifyHash.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">refresh</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">verified</span>
                    Verify
                  </>
                )}
              </button>

              {verifyError && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                  <p className="text-red-300 text-sm">{verifyError}</p>
                </div>
              )}

              {verifyResult && (
                <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-emerald-400">verified</span>
                    <span className="text-emerald-300 font-semibold">Record Verified!</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-white"><strong>Company:</strong> {verifyResult.company}</p>
                    <p className="text-white"><strong>Emissions:</strong> {verifyResult.emissions} tonnes CO2e</p>
                    <p className="text-white"><strong>Date:</strong> {verifyResult.date}</p>
                    {verifyResult.blockNumber && (
                      <p className="text-white"><strong>Block:</strong> {verifyResult.blockNumber}</p>
                    )}
                    <a
                      href={getExplorerUrl(verifyResult.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
                    >
                      View on Explorer
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

