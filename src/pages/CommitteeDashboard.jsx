import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import WalletConnect from '../components/WalletConnect'
import { getExplorerUrl, submitESGData } from '../utils/blockchain'
import { useApp } from '../context/AppContext'

function CommitteeDashboard() {
    const { isConnected, address } = useWallet()
    const navigate = useNavigate()
    const { setRole } = useApp()
    const [realStats, setRealStats] = useState({
        totalSubmissions: 0,
        verifiedRecords: 0,
        totalEmissions: 0,
        uniqueCompanies: 0,
        onChainCount: 0
    })
    const [recentSubmissions, setRecentSubmissions] = useState([])
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState(null)
    const [submitError, setSubmitError] = useState(null)
    const [formData, setFormData] = useState({
        companyName: '',
        registrationId: '',
        industrySector: '',
        reportingYear: '2024',
        scope1Emissions: '',
        scope2Emissions: ''
    })

    useEffect(() => {
        const loadStats = () => {
            const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
            setRecentSubmissions(submissions.slice(0, 5))
            setRealStats({
                totalSubmissions: submissions.length,
                verifiedRecords: submissions.filter(s => s.status === 'approved').length,
                totalEmissions: submissions.reduce((sum, s) => sum + parseFloat(s.emissions || 0), 0).toFixed(2),
                uniqueCompanies: new Set(submissions.map(s => s.company)).size,
                onChainCount: submissions.filter(s => s.isRealBlockchain).length
            })
        }
        loadStats()
        const interval = setInterval(loadStats, 2000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        setRole(null)
        localStorage.removeItem('userRole')
        navigate('/')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const calculateEmissions = () => {
        const s1 = parseFloat(formData.scope1Emissions) || 0
        const s2 = parseFloat(formData.scope2Emissions) || 0
        return (s1 + s2).toFixed(2)
    }

    // Generate Sepolia hash for demo
    const generateHash = () => {
        const chars = '0123456789abcdef'
        let hash = '0x'
        for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]
        return hash
    }

    const handleQuickSubmit = async () => {
        if (!formData.companyName || !formData.scope1Emissions) {
            setSubmitError('Please fill Company Name and Scope 1 Emissions')
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitResult(null)

        try {
            const totalEmissions = calculateEmissions()
            const batchId = `ESG-${formData.reportingYear}-${Date.now().toString(36).toUpperCase()}`

            let result
            let isRealBlockchain = false

            if (isConnected) {
                // Real blockchain submission
                try {
                    result = await submitESGData({
                        companyName: formData.companyName,
                        batchId: batchId,
                        emissions: totalEmissions,
                        energySource: formData.industrySector || 'General'
                    })
                    isRealBlockchain = true
                } catch (err) {
                    console.log('Blockchain error, using demo mode:', err)
                }
            }

            if (!result) {
                // Demo mode - instant
                await new Promise(resolve => setTimeout(resolve, 500))
                result = {
                    transactionHash: generateHash(),
                    blockNumber: 7000000 + Math.floor(Math.random() * 500000),
                    network: 'Sepolia Testnet'
                }
            }

            // Save to localStorage
            const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
            submissions.unshift({
                id: submissions.length + 1,
                company: formData.companyName,
                emissions: totalEmissions,
                txHash: result.transactionHash,
                blockNumber: result.blockNumber,
                date: new Date().toLocaleDateString(),
                network: 'Sepolia Testnet',
                status: 'approved',
                isRealBlockchain,
                walletAddress: address || 'demo',
                formData
            })
            localStorage.setItem('esg_submissions', JSON.stringify(submissions))

            setSubmitResult({ ...result, isRealBlockchain })
            setFormData({
                companyName: '',
                registrationId: '',
                industrySector: '',
                reportingYear: '2024',
                scope1Emissions: '',
                scope2Emissions: ''
            })
        } catch (err) {
            setSubmitError('Error: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const industrySectors = ['Energy & Utilities', 'Manufacturing', 'Technology', 'Transportation', 'Construction', 'Agriculture', 'Healthcare', 'Financial Services', 'Retail', 'Other']

    const stats = [
        { label: 'Total Submissions', value: realStats.totalSubmissions, icon: 'description', color: 'blue' },
        { label: 'On-Chain Records', value: realStats.onChainCount, icon: 'token', color: 'emerald' },
        { label: 'Companies Monitored', value: realStats.uniqueCompanies, icon: 'business', color: 'purple' },
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
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">E</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">ESGChain</h1>
                                <p className="text-xs text-emerald-300">COMMITTEE DASHBOARD</p>
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

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Hero */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-4xl font-bold text-white">Committee Portal</h2>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                            ✓ Verified Member
                        </span>
                    </div>
                    <p className="text-blue-200 text-lg">Submit and manage ESG data for companies. All data is recorded on blockchain.</p>
                </div>

                {/* Quick Submit Card */}
                <div className="bg-gradient-to-r from-emerald-600/30 to-blue-600/30 backdrop-blur-md rounded-xl border border-emerald-400/30 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <span className="material-symbols-outlined text-white text-3xl">add_circle</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Submit ESG Data</h3>
                                <p className="text-emerald-200">Record company environmental data on blockchain</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                            >
                                <span className="material-symbols-outlined">bolt</span>
                                Quick Submit
                            </button>
                            <Link
                                to="/submit"
                                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">open_in_new</span>
                                Full Form
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Link to="/history" className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-400">history</span>
                        <span className="text-white font-medium">View History</span>
                    </Link>
                    <Link to="/admin" className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3">
                        <span className="material-symbols-outlined text-purple-400">admin_panel_settings</span>
                        <span className="text-white font-medium">Admin Panel</span>
                    </Link>
                    <a href="https://sepolia.etherscan.io/address/0x82a762A808760ad4330Cca3aEf7871519A80EFCb" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-400">token</span>
                        <span className="text-white font-medium">View Contract</span>
                    </a>
                    <button onClick={() => setShowSubmitModal(true)} className="bg-emerald-600 rounded-xl p-4 hover:bg-emerald-700 transition-all flex items-center gap-3">
                        <span className="material-symbols-outlined text-white">add</span>
                        <span className="text-white font-medium">New Submission</span>
                    </button>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Your Recent Submissions</h3>
                            <Link to="/history" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {recentSubmissions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-emerald-400 text-3xl">add_circle</span>
                            </div>
                            <p className="text-blue-200 mb-4">No submissions yet. Start by submitting ESG data!</p>
                            <button onClick={() => setShowSubmitModal(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                Submit First Record
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {recentSubmissions.map((sub, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                                            {sub.company?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{sub.company}</p>
                                            <p className="text-sm text-blue-300">{sub.emissions} tonnes CO2e • {sub.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {sub.isRealBlockchain ? (
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">ON-CHAIN</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">LOCAL</span>
                                        )}
                                        {sub.isRealBlockchain && (
                                            <a href={getExplorerUrl(sub.txHash)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
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

            {/* Quick Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl max-w-xl w-full p-6 border border-white/20 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Quick ESG Submission</h3>
                            <button onClick={() => { setShowSubmitModal(false); setSubmitResult(null); setSubmitError(null); }} className="text-blue-300 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {!submitResult ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-blue-200 mb-1">Company Name *</label>
                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-1">Industry Sector</label>
                                        <select name="industrySector" value={formData.industrySector} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                                            <option value="" className="bg-slate-800">Select sector</option>
                                            {industrySectors.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-1">Reporting Year</label>
                                        <select name="reportingYear" value={formData.reportingYear} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                                            <option value="2024" className="bg-slate-800">2024</option>
                                            <option value="2023" className="bg-slate-800">2023</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-1">Scope 1 Emissions *</label>
                                        <input type="number" name="scope1Emissions" value={formData.scope1Emissions} onChange={handleChange} placeholder="tonnes CO2e" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-1">Scope 2 Emissions</label>
                                        <input type="number" name="scope2Emissions" value={formData.scope2Emissions} onChange={handleChange} placeholder="tonnes CO2e" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300" />
                                    </div>
                                </div>

                                <div className="p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg mb-4 flex justify-between items-center">
                                    <span className="text-blue-200">Total Emissions:</span>
                                    <span className="text-xl font-bold text-white">{calculateEmissions()} tonnes CO2e</span>
                                </div>

                                {submitError && (
                                    <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg mb-4">
                                        <p className="text-red-300 text-sm">{submitError}</p>
                                    </div>
                                )}

                                <button onClick={handleQuickSubmit} disabled={isSubmitting} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <><span className="animate-spin material-symbols-outlined">refresh</span> Submitting...</>
                                    ) : (
                                        <><span className="material-symbols-outlined">rocket_launch</span> Submit to Blockchain</>
                                    )}
                                </button>

                                <p className="text-center text-sm text-blue-300 mt-3">
                                    {isConnected ? '✓ MetaMask connected - Real blockchain transaction' : '○ Demo mode - Connect MetaMask for real transactions'}
                                </p>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Submitted Successfully!</h4>
                                <p className="text-blue-200 mb-4">ESG data has been recorded {submitResult.isRealBlockchain ? 'on Sepolia blockchain' : 'locally'}</p>

                                <code className="block bg-white/10 px-3 py-2 rounded text-sm text-blue-300 font-mono mb-4 break-all">
                                    {submitResult.transactionHash}
                                </code>

                                {submitResult.isRealBlockchain && (
                                    <a
                                        href={getExplorerUrl(submitResult.transactionHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        View on Etherscan
                                    </a>
                                )}

                                <button
                                    onClick={() => { setShowSubmitModal(false); setSubmitResult(null); }}
                                    className="block w-full py-2 text-blue-300 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommitteeDashboard
