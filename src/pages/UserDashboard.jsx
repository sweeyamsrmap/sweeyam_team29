import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import WalletConnect from '../components/WalletConnect'
import QRScanner from '../components/QRScanner'
import { getExplorerUrl } from '../utils/blockchain'
import { useApp } from '../context/AppContext'

function UserDashboard() {
    const { isConnected } = useWallet()
    const navigate = useNavigate()
    const { setRole } = useApp()
    const [realStats, setRealStats] = useState({
        totalSubmissions: 0,
        verifiedRecords: 0,
        totalEmissions: 0,
        uniqueCompanies: 0
    })
    const [showVerifyModal, setShowVerifyModal] = useState(false)
    const [showQRScanner, setShowQRScanner] = useState(false)
    const [verifyHash, setVerifyHash] = useState('')
    const [verifyResult, setVerifyResult] = useState(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [verifyError, setVerifyError] = useState(null)
    const [recentSubmissions, setRecentSubmissions] = useState([])

    useEffect(() => {
        const loadStats = () => {
            const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
            setRecentSubmissions(submissions.slice(0, 5))
            setRealStats({
                totalSubmissions: submissions.length,
                verifiedRecords: submissions.filter(s => s.status === 'approved').length,
                totalEmissions: submissions.reduce((sum, s) => sum + parseFloat(s.emissions || 0), 0).toFixed(2),
                uniqueCompanies: new Set(submissions.map(s => s.company)).size
            })
        }
        loadStats()
        const interval = setInterval(loadStats, 2000)
        return () => clearInterval(interval)
    }, [])

    const handleVerify = async (hash) => {
        const hashToVerify = hash || verifyHash
        if (!hashToVerify.trim()) return
        setIsVerifying(true)
        setVerifyError(null)
        setVerifyResult(null)

        try {
            const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
            const found = submissions.find(s =>
                s.txHash?.toLowerCase() === hashToVerify.toLowerCase() ||
                s.recordHash?.toLowerCase() === hashToVerify.toLowerCase()
            )

            if (found) {
                setVerifyResult({
                    verified: true,
                    company: found.company,
                    emissions: found.emissions,
                    date: found.date,
                    txHash: found.txHash,
                    blockNumber: found.blockNumber,
                    isRealBlockchain: found.isRealBlockchain
                })
                setShowVerifyModal(true)
            } else {
                setVerifyError('Record not found. Please check the transaction hash.')
                setShowVerifyModal(true)
            }
        } catch (err) {
            setVerifyError('Error verifying record: ' + err.message)
        } finally {
            setIsVerifying(false)
        }
    }

    const handleQRScan = (scannedData) => {
        setShowQRScanner(false)
        setVerifyHash(scannedData)
        handleVerify(scannedData)
    }

    const handleLogout = () => {
        setRole(null)
        localStorage.removeItem('userRole')
        navigate('/')
    }

    const stats = [
        { label: 'Companies Monitored', value: realStats.uniqueCompanies, icon: 'business', color: 'blue' },
        { label: 'Verified Reports', value: realStats.verifiedRecords, icon: 'verified', color: 'emerald' },
        { label: 'Total Submissions', value: realStats.totalSubmissions, icon: 'description', color: 'purple' },
        { label: 'Total Emissions', value: `${realStats.totalEmissions} t`, icon: 'eco', color: 'orange' }
    ]

    const colorClasses = {
        blue: 'bg-blue-500/20 text-blue-400',
        emerald: 'bg-emerald-500/20 text-emerald-400',
        purple: 'bg-purple-500/20 text-purple-400',
        orange: 'bg-orange-500/20 text-orange-400'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">E</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">ESGChain</h1>
                                <p className="text-xs text-blue-300">USER DASHBOARD</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <WalletConnect />
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">logout</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2">Welcome to ESGChain</h2>
                    <p className="text-blue-200 text-lg">View verified ESG data from companies, stored on blockchain for transparency</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all cursor-pointer hover:scale-105">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-blue-200">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Link
                        to="/history"
                        className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-500 hover:to-blue-600 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">search</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">View Companies</h3>
                                <p className="text-blue-200 text-sm">Browse all ESG data</p>
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={() => setShowVerifyModal(true)}
                        className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 hover:from-emerald-500 hover:to-emerald-600 transition-all group text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">verified</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Verify Data</h3>
                                <p className="text-emerald-200 text-sm">Check records</p>
                            </div>
                        </div>
                    </button>

                    {/* QR Scan Button */}
                    <button
                        onClick={() => setShowQRScanner(true)}
                        className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 hover:from-orange-500 hover:to-orange-600 transition-all group text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">qr_code_scanner</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Scan QR</h3>
                                <p className="text-orange-200 text-sm">Scan certificate</p>
                            </div>
                        </div>
                    </button>

                    <a
                        href="https://sepolia.etherscan.io/address/0x82a762A808760ad4330Cca3aEf7871519A80EFCb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 hover:from-purple-500 hover:to-purple-600 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">open_in_new</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">View Contract</h3>
                                <p className="text-purple-200 text-sm">On Etherscan</p>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Recent ESG Submissions</h3>
                            <Link to="/history" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {recentSubmissions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-blue-400 text-3xl">inbox</span>
                            </div>
                            <p className="text-blue-200">No submissions yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {recentSubmissions.map((sub, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                            {sub.company?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{sub.company}</p>
                                            <p className="text-sm text-blue-300">{sub.emissions} tonnes CO2e • {sub.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {sub.isRealBlockchain && (
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">ON-CHAIN</span>
                                        )}
                                        {sub.isRealBlockchain && (
                                            <a
                                                href={getExplorerUrl(sub.txHash)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onClose={() => setShowQRScanner(false)}
                />
            )}

            {/* Verify Modal */}
            {showVerifyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Verify ESG Record</h3>
                            <button onClick={() => { setShowVerifyModal(false); setVerifyResult(null); setVerifyError(null); }} className="text-blue-300 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-blue-200 mb-2">Transaction Hash</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={verifyHash}
                                    onChange={(e) => setVerifyHash(e.target.value)}
                                    placeholder="0x..."
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => setShowQRScanner(true)}
                                    className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                    title="Scan QR Code"
                                >
                                    <span className="material-symbols-outlined">qr_code_scanner</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => handleVerify()}
                            disabled={isVerifying || !verifyHash.trim()}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isVerifying ? (
                                <><span className="animate-spin material-symbols-outlined">refresh</span> Verifying...</>
                            ) : (
                                <><span className="material-symbols-outlined">verified</span> Verify Record</>
                            )}
                        </button>

                        {verifyError && (
                            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                <p className="text-red-300">{verifyError}</p>
                            </div>
                        )}

                        {verifyResult && (
                            <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                                    <span className="font-bold text-emerald-300">Record Verified!</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-white"><strong>Company:</strong> {verifyResult.company}</p>
                                    <p className="text-white"><strong>Emissions:</strong> {verifyResult.emissions} tonnes CO2e</p>
                                    <p className="text-white"><strong>Date:</strong> {verifyResult.date}</p>
                                    {verifyResult.isRealBlockchain && (
                                        <a
                                            href={getExplorerUrl(verifyResult.txHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                        >
                                            View on Etherscan <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDashboard
