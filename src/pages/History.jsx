import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExplorerUrl } from '../utils/blockchain'
import VerificationCertificate from '../components/VerificationCertificate'

function History() {
    const [submissions, setSubmissions] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    // Load submissions from localStorage
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

    // Filter submissions based on search
    const filteredSubmissions = submissions.filter(sub => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            sub.company?.toLowerCase().includes(query) ||
            sub.txHash?.toLowerCase().includes(query) ||
            sub.formData?.industrySector?.toLowerCase().includes(query)
        )
    })

    const exportToCSV = () => {
        if (filteredSubmissions.length === 0) return

        const headers = ['Company', 'Emissions (tCO2e)', 'Transaction Hash', 'Date', 'Network', 'Industry']
        const csvRows = [
            headers.join(','),
            ...filteredSubmissions.map(sub => [
                `"${sub.company}"`,
                sub.emissions,
                sub.txHash,
                sub.date,
                sub.network,
                `"${sub.formData?.industrySector || 'General'}"`
            ].join(','))
        ]

        const csvString = csvRows.join('\n')
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'ESGChain_Records.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear all LOCAL history? On-chain records will NOT be deleted.')) {
            localStorage.removeItem('esg_submissions')
            setSubmissions([])
        }
    }

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link to="/dashboard" className="text-blue-300 hover:text-blue-200 text-sm mb-2 inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Dashboard
                            </Link>
                            <h1 className="text-4xl font-bold text-white mt-2">Company ESG History</h1>
                            <p className="text-blue-200 mt-2">View all verified ESG submissions stored on the blockchain</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToCSV}
                                    disabled={filteredSubmissions.length === 0}
                                    className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-400/30 rounded-lg text-sm font-medium hover:bg-emerald-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Export CSV
                                </button>
                                <button
                                    onClick={clearHistory}
                                    className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-400/30 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                                    Clear Local
                                </button>
                            </div>
                            <span className="text-blue-300 text-sm">{filteredSubmissions.length} records found</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-6">
                        <div className="relative max-w-xl">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">search</span>
                            <input
                                type="text"
                                placeholder="Search by company name, transaction hash, or industry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {filteredSubmissions.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-blue-400 text-3xl">inbox</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Submissions Found</h3>
                        <p className="text-blue-200 mb-4">
                            {searchQuery ? 'No records match your search criteria.' : 'No ESG data has been submitted yet.'}
                        </p>
                        {!searchQuery && (
                            <Link
                                to="/submit"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                Submit ESG Data
                            </Link>
                        )}
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredSubmissions.map((submission, index) => {
                            const logo = submission.company?.charAt(0).toUpperCase() || 'E'
                            const logoColors = ['bg-emerald-600', 'bg-teal-600', 'bg-blue-600', 'bg-purple-600', 'bg-orange-600']
                            const logoColor = logoColors[index % logoColors.length]
                            const isReal = submission.isRealBlockchain

                            return (
                                <div key={submission.id || index} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 ${logoColor} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                                {logo}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-bold text-white">{submission.company}</h3>
                                                    {isReal && (
                                                        <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full">
                                                            ON-CHAIN
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-blue-200 flex items-center gap-2 mt-1">
                                                    <code className="text-xs bg-white/10 px-2 py-1 rounded">{submission.txHash?.slice(0, 20)}...</code>
                                                    {isReal && (
                                                        <a
                                                            href={getExplorerUrl(submission.txHash)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300"
                                                            title="View on Etherscan"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                        </a>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-blue-300 mb-1">SUBMISSION DATE</p>
                                            <p className="text-sm font-semibold text-white">{submission.date}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 mb-4">
                                        <div>
                                            <p className="text-xs text-blue-300 mb-1">NET EMISSIONS</p>
                                            <p className="text-xl font-bold text-white">
                                                {parseFloat(submission.emissions).toLocaleString()}{' '}
                                                <span className="text-sm font-normal text-blue-200">tonnes CO2e</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-300 mb-1">INDUSTRY SECTOR</p>
                                            <p className="text-sm font-medium text-white">
                                                {submission.formData?.industrySector || 'General'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-300 mb-1">BLOCKCHAIN STATUS</p>
                                            <p className="text-lg font-bold text-emerald-400">
                                                ✓ {isReal ? 'Verified on Sepolia' : 'Verified'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
                                                className={`flex items-center gap-2 px-4 py-2 ${isReal ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-sm font-medium transition-colors`}
                                            >
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                View Certificate
                                            </button>
                                        </div>
                                        <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 rounded-lg text-sm font-medium">
                                            ✓ Verified
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
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

export default History
