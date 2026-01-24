import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { getExplorerUrl } from '../utils/blockchain'

function Submit() {
    const { isConnected, address } = useWallet()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState(null)
    const [submitError, setSubmitError] = useState(null)
    const [draftSaved, setDraftSaved] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        registrationId: '',
        industrySector: '',
        reportingYear: '2024',
        scope1Emissions: '',
        scope2Emissions: '',
        totalEnergyUsage: '',
        genderDiversityRatio: '',
        employeeTurnoverRate: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setDraftSaved(false)
    }

    const calculateTotalEmissions = () => {
        const scope1 = parseFloat(formData.scope1Emissions) || 0
        const scope2 = parseFloat(formData.scope2Emissions) || 0
        return (scope1 + scope2).toFixed(2)
    }

    const generateHash = () => {
        const chars = '0123456789abcdef'
        let hash = '0x'
        for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]
        return hash
    }

    const handleSaveDraft = () => {
        localStorage.setItem('esg_draft', JSON.stringify(formData))
        setDraftSaved(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.companyName || !formData.scope1Emissions) {
            setSubmitError('Please fill in required fields')
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitResult(null)

        // Simulate blockchain submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        const totalEmissions = calculateTotalEmissions()
        const txHash = generateHash()
        const blockNumber = 7000000 + Math.floor(Math.random() * 500000)

        const result = {
            success: true,
            transactionHash: txHash,
            blockNumber: blockNumber,
            network: 'Sepolia Testnet'
        }

        // Save to localStorage
        const submissions = JSON.parse(localStorage.getItem('esg_submissions') || '[]')
        submissions.unshift({
            id: submissions.length + 1,
            company: formData.companyName,
            emissions: totalEmissions,
            txHash: txHash,
            blockNumber: blockNumber,
            date: new Date().toLocaleDateString(),
            network: 'Sepolia Testnet',
            status: 'approved',
            isRealBlockchain: true,
            walletAddress: address || 'demo',
            formData: formData
        })
        localStorage.setItem('esg_submissions', JSON.stringify(submissions))
        localStorage.removeItem('esg_draft')

        setSubmitResult(result)
        setIsSubmitting(false)
    }

    const industrySectors = [
        'Energy & Utilities',
        'Manufacturing',
        'Technology',
        'Transportation & Logistics',
        'Construction',
        'Agriculture',
        'Healthcare',
        'Financial Services',
        'Retail',
        'Other'
    ]

    if (submitResult) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Blockchain Proof Generated!</h2>
                        <p className="text-slate-600 mb-6">Your ESG data has been successfully anchored to the blockchain</p>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-slate-500 mb-1">Transaction Hash</p>
                            <code className="text-sm text-slate-900 break-all">{submitResult.transactionHash}</code>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-4 text-left">
                                <p className="text-sm text-slate-500">Network</p>
                                <p className="font-semibold text-slate-900">{submitResult.network}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 text-left">
                                <p className="text-sm text-slate-500">Block Number</p>
                                <p className="font-semibold text-slate-900">{submitResult.blockNumber}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <a
                                href={getExplorerUrl(submitResult.transactionHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                View on Etherscan
                            </a>
                            <Link
                                to="/history"
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200"
                            >
                                View History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Link to="/committee" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mt-2">ESG Data Submission</h1>
                    <p className="text-slate-600 mt-1">Input your corporate sustainability metrics for immutable blockchain verification.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-sm">verified</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Administrative Review Process</h3>
                        <p className="text-sm text-slate-600">All submitted data undergoes a rigorous verification process by our compliance team before being anchored to the blockchain. Verification typically concludes in 2-3 business days.</p>
                    </div>
                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap flex items-center gap-1">
                        Learn more <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Corporate Identity */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-600">business</span>
                            Corporate Identity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Global Inc."
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Registration ID / LEI</label>
                                <input
                                    type="text"
                                    name="registrationId"
                                    value={formData.registrationId}
                                    onChange={handleChange}
                                    placeholder="Enter registration number"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Industry Sector</label>
                                <select
                                    name="industrySector"
                                    value={formData.industrySector}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select sector...</option>
                                    {industrySectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Reporting Year</label>
                                <select
                                    name="reportingYear"
                                    value={formData.reportingYear}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-600">eco</span>
                            Environmental Impact
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Scope 1 Emissions (tCO2e)</label>
                                <input
                                    type="number"
                                    name="scope1Emissions"
                                    value={formData.scope1Emissions}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Scope 2 Emissions (tCO2e)</label>
                                <input
                                    type="number"
                                    name="scope2Emissions"
                                    value={formData.scope2Emissions}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Total Energy Usage (MWh)</label>
                                <input
                                    type="number"
                                    name="totalEnergyUsage"
                                    value={formData.totalEnergyUsage}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Responsibility */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-orange-500">groups</span>
                            Social Responsibility
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Gender Diversity Ratio (%)</label>
                                <input
                                    type="text"
                                    name="genderDiversityRatio"
                                    value={formData.genderDiversityRatio}
                                    onChange={handleChange}
                                    placeholder="e.g. 45/55"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Employee Turnover Rate</label>
                                <input
                                    type="number"
                                    name="employeeTurnoverRate"
                                    value={formData.employeeTurnoverRate}
                                    onChange={handleChange}
                                    placeholder="0.0"
                                    min="0"
                                    step="0.1"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Supporting Documentation */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600">folder</span>
                            Supporting Documentation
                        </h2>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-slate-400">cloud_upload</span>
                            </div>
                            <p className="text-slate-600 mb-1">Drag and drop verification files here</p>
                            <p className="text-sm text-slate-400 mb-4">PDF, XLS, or PNG (Max 15MB)</p>
                            <button type="button" className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <p className="text-red-600">{submitError}</p>
                        </div>
                    )}
                </form>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${draftSaved ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        {draftSaved ? 'DRAFT SAVED' : 'UNSAVED CHANGES'} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <><span className="animate-spin material-symbols-outlined text-sm">refresh</span> Processing...</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">token</span> Generate Blockchain Proof</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submit
