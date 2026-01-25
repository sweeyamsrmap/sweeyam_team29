import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useNotification } from '../context/NotificationContext'
import { getExplorerUrl } from '../utils/blockchain'

function Drafts() {
    const { isConnected, address } = useWallet()
    const notification = useNotification()
    const navigate = useNavigate()
    const [drafts, setDrafts] = useState([])
    const [selectedDraft, setSelectedDraft] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadDrafts()
    }, [])

    const loadDrafts = () => {
        const savedDrafts = JSON.parse(localStorage.getItem('esg_drafts') || '[]')
        setDrafts(savedDrafts)
    }

    const generateHash = () => {
        const chars = '0123456789abcdef'
        let hash = '0x'
        for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]
        return hash
    }

    const handleConfirmSubmit = async (draft) => {
        setIsSubmitting(true)

        const isRealBlockchain = isConnected
        let txHash, recordHash, blockNumber, submissionResult

        try {
            if (isRealBlockchain) {
                notification.info('Submitting to Sepolia blockchain... Please confirm in MetaMask')
                const { submitESGData } = await import('../utils/blockchain')

                try {
                    submissionResult = await submitESGData({
                        companyName: draft.companyName,
                        batchId: `ESG-${draft.reportingYear}-${Date.now().toString(36).toUpperCase()}`,
                        emissions: draft.totalEmissions,
                        energySource: draft.industrySector || 'General'
                    })

                    txHash = submissionResult.transactionHash
                    recordHash = submissionResult.recordHash
                    blockNumber = submissionResult.blockNumber
                } catch (blockchainError) {
                    console.error('Blockchain error:', blockchainError)
                    notification.warning('Blockchain submission failed, saving in demo mode')
                    txHash = generateHash()
                    recordHash = generateHash()
                    blockNumber = 7000000 + Math.floor(Math.random() * 500000)
                }
            } else {
                notification.info('Saving in demo mode (connect MetaMask for real blockchain)')
                await new Promise(resolve => setTimeout(resolve, 1500))
                txHash = generateHash()
                recordHash = generateHash()
                blockNumber = 7000000 + Math.floor(Math.random() * 500000)
            }

            const wasRealTransaction = isRealBlockchain && submissionResult?.transactionHash

            const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
            submissions.unshift({
                id: submissions.length + 1,
                company: draft.companyName,
                emissions: draft.totalEmissions,
                txHash: txHash,
                recordHash: recordHash,
                blockNumber: blockNumber,
                date: new Date().toLocaleDateString(),
                network: wasRealTransaction ? 'Sepolia Testnet' : 'Demo Mode',
                status: 'approved',
                isRealBlockchain: wasRealTransaction,
                walletAddress: address || 'demo',
                formData: draft
            })
            localStorage.setItem('esg_submissions', JSON.stringify(submissions))

            const updatedDrafts = drafts.filter(d => d.id !== draft.id)
            localStorage.setItem('esg_drafts', JSON.stringify(updatedDrafts))
            setDrafts(updatedDrafts)

            if (wasRealTransaction) {
                notification.success('ESG data submitted to Sepolia blockchain!')
            } else {
                notification.success('ESG data saved locally (Demo Mode)')
            }
        } catch (error) {
            console.error('Submission error:', error)
            notification.error('Error: ' + error.message)
        }

        setSelectedDraft(null)
        setIsSubmitting(false)
    }

    const handleDeleteDraft = (draftId) => {
        const updatedDrafts = drafts.filter(d => d.id !== draftId)
        localStorage.setItem('esg_drafts', JSON.stringify(updatedDrafts))
        setDrafts(updatedDrafts)
        notification.info('Draft deleted')
        setSelectedDraft(null)
    }

    const handleEditDraft = (draft) => {
        localStorage.setItem('editing_draft', JSON.stringify(draft))
        navigate('/submit')
    }

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <Link to="/committee" className="text-blue-300 hover:text-blue-200 text-sm mb-4 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">Draft Submissions</h1>
                    <p className="text-blue-200 mt-1">Review and confirm your ESG data before submitting to blockchain.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Info Banner */}
                <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4 mb-6 flex items-start gap-4 backdrop-blur-md">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-sm">info</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Review Before Submitting</h3>
                        <p className="text-sm text-blue-200 text-xs">Drafts are stored locally. Once confirmed, data will be permanently recorded on the blockchain.</p>
                    </div>
                </div>

                {drafts.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-blue-400 text-3xl">drafts</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Drafts</h3>
                        <p className="text-blue-200 mb-6">You haven't saved any drafts yet.</p>
                        <Link to="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Create New Submission
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {drafts.map((draft) => (
                            <div key={draft.id} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full font-bold uppercase tracking-wider">DRAFT</span>
                                                <span className="text-[10px] text-blue-400">{draft.savedAt}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">{draft.companyName}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-[10px] text-blue-400 uppercase font-bold">Industry</p>
                                            <p className="text-sm font-medium text-white">{draft.industrySector || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-400 uppercase font-bold">Year</p>
                                            <p className="text-sm font-medium text-white">{draft.reportingYear}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-400 uppercase font-bold">Total Emissions</p>
                                            <p className="text-sm font-bold text-emerald-400">{draft.totalEmissions} tCO2e</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => setSelectedDraft(draft)}
                                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Confirm & Submit
                                        </button>
                                        <button
                                            onClick={() => handleEditDraft(draft)}
                                            className="flex-1 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg font-medium hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDraft(draft.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link to="/submit" className="block mt-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border-2 border-dashed border-white/10 p-6 text-center hover:border-blue-500/50 hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-blue-400 text-3xl mb-2">add_circle</span>
                        <p className="text-blue-200">Create New Submission</p>
                    </div>
                </Link>
            </div>

            {/* Confirmation Modal */}
            {selectedDraft && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Confirm Submission</h3>
                            <button onClick={() => setSelectedDraft(null)} className="text-white/60 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {isConnected ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                                    <div>
                                        <p className="font-medium text-emerald-400 text-sm">MetaMask Connected</p>
                                        <p className="text-xs text-emerald-500/70">Data will be anchored to Sepolia</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-400">info</span>
                                    <div>
                                        <p className="font-medium text-blue-400 text-sm">Demo Mode</p>
                                        <p className="text-xs text-blue-500/70">Connect MetaMask for Sepolia</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-blue-300 text-sm">Company</span>
                                <span className="font-medium text-white">{selectedDraft.companyName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                                <span className="text-blue-300">Emissions</span>
                                <span className="font-bold text-emerald-400">{selectedDraft.totalEmissions} tCO2e</span>
                            </div>
                        </div>

                        {/* Permanence Warning */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-4 backdrop-blur-md">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                                <span className="material-symbols-outlined text-white text-lg">warning</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-red-400 text-sm">Blockchain Immutability Warning</h3>
                                <p className="text-[10px] text-red-200/70 font-medium leading-tight mt-1">
                                    Once submitted, this record is permanently anchored to the blockchain. <span className="text-red-400 font-black">Under no circumstances can this data be modified or deleted.</span> Are you sure you want to proceed?
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedDraft(null)}
                                className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleConfirmSubmit(selectedDraft)}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Drafts
