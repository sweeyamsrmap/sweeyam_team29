import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useNotification } from '../context/NotificationContext'
import { getExplorerUrl } from '../utils/blockchain'

const MetricField = ({ label, value, name, unit, path, onChange, onUnitChange, type = "number", options = null }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
        <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-blue-300 uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">CLAIMED</span>
            </div>
        </div>
        <div className="flex gap-2">
            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e, path)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {options.map(opt => <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e, path)}
                    placeholder="0.00"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            )}
            {onUnitChange ? (
                <input
                    type="text"
                    value={unit}
                    onChange={(e) => onUnitChange(e, path, name)}
                    className="flex items-center px-2 bg-white/10 rounded-lg border border-white/20 text-[10px] font-bold text-blue-400 w-[65px] text-center uppercase outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="UNIT"
                />
            ) : unit && (
                <span className="flex items-center px-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-blue-400 min-w-[40px] justify-center uppercase">{unit}</span>
            )}
        </div>
    </div>
)

function Submit() {
    const { isConnected, address } = useWallet()
    const notification = useNotification()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState(null)
    const [submitError, setSubmitError] = useState(null)
    const [draftSaved, setDraftSaved] = useState(false)
    const [supportingDocs, setSupportingDocs] = useState([])
    const fileInputRef = useRef(null)
    const ACCEPTED_TYPES = ['.pdf', '.xls', '.xlsx', '.png']
    const MAX_SIZE = 15 * 1024 * 1024 // 15MB
    const [formData, setFormData] = useState({
        companyName: '',
        registrationId: '',
        industrySector: '',
        reportingYear: '2024',
        scope1Emissions: { value: '', verified: '', source: 'Self-reported', status: 'Claimed' },
        scope2Emissions: { value: '', verified: '', source: 'Self-reported', status: 'Claimed' },
        additionalEnvironmental: [],
        social: {
            employeeWelfare: {
                avgSalary: { value: '', unit: 'USD', source: 'HR Records', status: 'Claimed' },
                medianSalary: { value: '', unit: 'USD', source: 'HR Records', status: 'Claimed' },
                genderPayGap: { value: '', unit: '%', source: 'Payroll Audit', status: 'Claimed' },
                minWageCompliance: { value: 'yes', source: 'Compliance Officer', status: 'Claimed' },
                turnoverRate: { value: '', unit: '%', source: 'HR Records', status: 'Claimed' }
            },
            workplaceConditions: {
                weeklyHours: { value: '', unit: 'hrs', source: 'Time Tracking', status: 'Claimed' },
                safetyIncidents: { value: '', unit: 'count', source: 'Safety Logs', status: 'Claimed' },
                benefitsCoverage: { value: 'yes', source: 'Benefits Provider', status: 'Claimed' }
            },
            diversityInclusion: {
                genderRatio: { value: '', unit: 'ratio', source: 'HR Records', status: 'Claimed' },
                minorityRepresentation: { value: '', unit: '%', source: 'HR Records', status: 'Claimed' },
                disabilityInclusion: { value: '', unit: '%', source: 'Diversity Audit', status: 'Claimed' }
            }
        },
        governance: {
            corporate: {
                boardSize: { value: '', unit: 'members', source: 'Corporate Secretary', status: 'Claimed' },
                independentDirectors: { value: '', unit: '%', source: 'Governance Committee', status: 'Claimed' },
                ceoChairSeparation: { value: 'yes', source: 'Bylaws', status: 'Claimed' }
            },
            ethics: {
                antiCorruption: { value: 'yes', source: 'Compliance Policy', status: 'Claimed' },
                violations: { value: '', unit: 'count', source: 'Legal Records', status: 'Claimed' },
                whistleblower: { value: 'yes', source: 'HR Policy', status: 'Claimed' }
            },
            transparency: {
                auditFrequency: { value: 'Annual', source: 'Board Charter', status: 'Claimed' },
                thirdPartyAudit: { value: 'yes', source: 'Auditors Report', status: 'Claimed' },
                publicDisclosure: { value: '', source: 'Investor Relations', status: 'Claimed' }
            }
        }
    })

    const handleChange = (e, path) => {
        const { name, value } = e.target
        setDraftSaved(false)

        if (path) {
            // Support for deeply nested ESG metrics without losing object structure
            const parts = path.split('.')
            setFormData(prev => {
                const newData = { ...prev }
                let current = newData

                // Traverse to the parent container
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i]
                    current[part] = { ...current[part] }
                    current = current[part]
                }

                // Update the specific metric's value while keeping other properties (unit, source, etc.)
                if (current[name] && typeof current[name] === 'object' && 'value' in current[name]) {
                    current[name] = {
                        ...current[name],
                        value: value
                    }
                } else {
                    current[name] = value
                }

                return newData
            })
        } else {
            // Support for basic fields and top-level metric objects
            if (formData[name] && typeof formData[name] === 'object' && 'value' in formData[name]) {
                setFormData(prev => ({
                    ...prev,
                    [name]: { ...prev[name], value: value }
                }))
            } else {
                setFormData(prev => ({ ...prev, [name]: value }))
            }
        }
    }

    const addPollutant = () => {
        setFormData(prev => ({
            ...prev,
            additionalEnvironmental: [
                ...prev.additionalEnvironmental,
                { type: 'NOx', quantity: '', unit: 'kg', method: 'self-reported', period: 'Annual', status: 'Claimed' }
            ]
        }))
    }

    const removePollutant = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalEnvironmental: prev.additionalEnvironmental.filter((_, i) => i !== index)
        }))
    }

    const updatePollutant = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            additionalEnvironmental: prev.additionalEnvironmental.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            )
        }))
    }

    const validateSupportingFile = (file) => {
        const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
        if (!ACCEPTED_TYPES.includes(ext)) return false
        if (file.size > MAX_SIZE) return false
        return true
    }

    const addSupportingDocs = (fileList) => {
        const valid = Array.from(fileList || []).filter(validateSupportingFile)
        const rejected = Array.from(fileList || []).filter(f => !validateSupportingFile(f))
        if (rejected.length) notification.error(`Some files were skipped. Use PDF, XLS, XLSX, or PNG (max 15MB).`)
        if (valid.length) {
            setSupportingDocs(prev => [...prev, ...valid])
            setDraftSaved(false)
        }
    }

    const removeSupportingDoc = (index) => {
        setSupportingDocs(prev => prev.filter((_, i) => i !== index))
        setDraftSaved(false)
    }

    const handleDocDrop = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('ring-2', 'ring-blue-500', 'border-blue-400')
        addSupportingDocs(e.dataTransfer.files)
    }

    const handleDocDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('ring-2', 'ring-blue-500', 'border-blue-400')
    }

    const handleDocDragLeave = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('ring-2', 'ring-blue-500', 'border-blue-400')
    }

    const calculateTotalEmissions = () => {
        const scope1 = parseFloat(formData.scope1Emissions.value) || 0
        const scope2 = parseFloat(formData.scope2Emissions.value) || 0
        return (scope1 + scope2).toFixed(2)
    }

    const handleUnitChange = (e, path, name) => {
        const { value } = e.target
        setDraftSaved(false)
        const parts = path.split('.')
        setFormData(prev => {
            const newData = { ...prev }
            let current = newData
            for (const part of parts) {
                current[part] = { ...current[part] }
                current = current[part]
            }
            if (current[name]) {
                current[name] = { ...current[name], unit: value }
            }
            return newData
        })
    }

    const handleSaveDraft = () => {
        if (!formData.companyName) {
            notification.error('Please enter a company name')
            return
        }

        const totalEmissions = calculateTotalEmissions()
        const drafts = JSON.parse(localStorage.getItem('esg_drafts') || '[]')
        const editingDraft = JSON.parse(localStorage.getItem('editing_draft') || 'null')

        const newDraft = {
            id: editingDraft?.id || Date.now(),
            ...formData,
            totalEmissions,
            supportingDocNames: supportingDocs.map(f => f.name),
            savedAt: new Date().toLocaleString()
        }

        if (editingDraft) {
            const updatedDrafts = drafts.map(d => d.id === editingDraft.id ? newDraft : d)
            localStorage.setItem('esg_drafts', JSON.stringify(updatedDrafts))
            localStorage.removeItem('editing_draft')
        } else {
            drafts.unshift(newDraft)
            localStorage.setItem('esg_drafts', JSON.stringify(drafts))
        }

        setDraftSaved(true)
        notification.success('Draft saved! Review and confirm before submitting to blockchain.')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.companyName || !formData.scope1Emissions) {
            setSubmitError('Please fill in required fields')
            notification.error('Please fill in required fields')
            return
        }

        const totalEmissions = calculateTotalEmissions()
        const drafts = JSON.parse(localStorage.getItem('esg_drafts') || '[]')
        const editingDraft = JSON.parse(localStorage.getItem('editing_draft') || 'null')

        const newDraft = {
            id: editingDraft?.id || Date.now(),
            ...formData,
            totalEmissions,
            supportingDocNames: supportingDocs.map(f => f.name),
            savedAt: new Date().toLocaleString()
        }

        if (editingDraft) {
            const updatedDrafts = drafts.map(d => d.id === editingDraft.id ? newDraft : d)
            localStorage.setItem('esg_drafts', JSON.stringify(updatedDrafts))
            localStorage.removeItem('editing_draft')
        } else {
            drafts.unshift(newDraft)
            localStorage.setItem('esg_drafts', JSON.stringify(drafts))
        }

        notification.success('Draft saved! Redirecting to review page...')
        setTimeout(() => {
            window.location.href = '/drafts'
        }, 1000)
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
            <div className="min-h-screen bg-transparent py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Blockchain Proof Generated!</h2>
                        <p className="text-blue-200 mb-6">Your ESG data has been successfully anchored to the blockchain</p>

                        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left border border-white/10">
                            <p className="text-sm text-blue-300 mb-1">Transaction Hash</p>
                            <code className="text-xs text-white break-all font-mono">{submitResult.transactionHash}</code>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-left border border-white/10">
                                <p className="text-sm text-blue-300">Network</p>
                                <p className="font-semibold text-white">{submitResult.network}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-left border border-white/10">
                                <p className="text-sm text-blue-300">Block Number</p>
                                <p className="font-semibold text-white">{submitResult.blockNumber}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <a
                                href={getExplorerUrl(submitResult.transactionHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                View on Explorer
                            </a>
                            <Link
                                to="/history"
                                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
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
        <div className="min-h-screen bg-transparent pb-32">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Link to="/committee" className="text-blue-300 hover:text-blue-200 text-sm mb-4 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-2">ESG Data Submission</h1>
                    <p className="text-blue-200 mt-1">Input corporate sustainability metrics for immutable blockchain verification.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Info Banner */}
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-8 flex items-start gap-4 backdrop-blur-md">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-sm">verified</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">Review Process</h3>
                        <p className="text-xs text-blue-200">Data undergoes verification by the compliance team before anchoring.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Corporate Identity */}
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-400">business</span>
                            Corporate Identity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Global Inc."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Industry Sector</label>
                                <select
                                    name="industrySector"
                                    value={formData.industrySector}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                                >
                                    <option value="" className="bg-slate-900">Select sector...</option>
                                    {industrySectors.map(sector => (
                                        <option key={sector} value={sector} className="bg-slate-900">{sector}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-400">eco</span>
                                Environmental Disclosure
                            </h2>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">Section E</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <MetricField
                                label="Scope 1 Emissions"
                                value={formData.scope1Emissions.value}
                                name="scope1Emissions"
                                unit="tCO2e"
                                onChange={handleChange}
                            />
                            <MetricField
                                label="Scope 2 Emissions"
                                value={formData.scope2Emissions.value}
                                name="scope2Emissions"
                                unit="tCO2e"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Dynamic Pollutants */}
                        <div className="border-t border-white/5 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-blue-200">Additional Environmental Factors</h3>
                                <button
                                    type="button"
                                    onClick={addPollutant}
                                    className="flex items-center gap-1 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all font-bold"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    ADD POLLUTANT
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.additionalEnvironmental.map((p, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white/5 p-3 rounded-xl border border-white/5 relative group">
                                        <div className="md:col-span-3">
                                            <select
                                                value={p.type}
                                                onChange={(e) => updatePollutant(index, 'type', e.target.value)}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                            >
                                                <option value="NOx">NOx</option>
                                                <option value="SO2">SO2</option>
                                                <option value="PM2.5">PM2.5 / PM10</option>
                                                <option value="Water Pollution">Water Pollution (BOD/COD)</option>
                                                <option value="Plastic Waste">Plastic Waste</option>
                                                <option value="Hazardous Waste">Hazardous Waste</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                value={p.quantity}
                                                onChange={(e) => updatePollutant(index, 'quantity', e.target.value)}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Unit"
                                                value={p.unit}
                                                onChange={(e) => updatePollutant(index, 'unit', e.target.value)}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <select
                                                value={p.method}
                                                onChange={(e) => updatePollutant(index, 'method', e.target.value)}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                                            >
                                                <option value="self-reported">Self-Reported</option>
                                                <option value="sensor">Sensor Data</option>
                                                <option value="audit">3rd Party Audit</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-1 flex justify-center items-center">
                                            <button
                                                type="button"
                                                onClick={() => removePollutant(index)}
                                                className="text-red-400 hover:text-red-300 opacity-60 hover:opacity-100 transition-all font-bold"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.additionalEnvironmental.length === 0 && (
                                    <p className="text-center py-4 text-xs text-blue-300/40 italic">No additional factors added. Click "Add Pollutant" to extend disclosure.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social (S) Module */}
                    <details className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                        <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-all outline-none">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-orange-400">groups</span>
                                Social Impact Factors
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 font-bold uppercase">Section S</span>
                                <span className="material-symbols-outlined text-white transition-transform group-open:rotate-180">expand_more</span>
                            </div>
                        </summary>
                        <div className="p-6 border-t border-white/5 flex flex-col gap-8">
                            {/* Employee Welfare */}
                            <div>
                                <h3 className="text-sm font-bold text-blue-300 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    1. EMPLOYEE WELFARE
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MetricField label="Average Salary" value={formData.social.employeeWelfare.avgSalary.value} name="avgSalary" path="social.employeeWelfare" unit={formData.social.employeeWelfare.avgSalary.unit} onChange={handleChange} onUnitChange={handleUnitChange} />
                                    <MetricField label="Gender Pay Gap" value={formData.social.employeeWelfare.genderPayGap.value} name="genderPayGap" path="social.employeeWelfare" unit="%" onChange={handleChange} />
                                    <MetricField label="Median Salary" value={formData.social.employeeWelfare.medianSalary.value} name="medianSalary" path="social.employeeWelfare" unit={formData.social.employeeWelfare.medianSalary.unit} onChange={handleChange} onUnitChange={handleUnitChange} />
                                    <MetricField label="Turnover Rate" value={formData.social.employeeWelfare.turnoverRate.value} name="turnoverRate" path="social.employeeWelfare" unit="%" onChange={handleChange} />
                                </div>
                            </div>

                            {/* Diversity */}
                            <div>
                                <h3 className="text-sm font-bold text-blue-300 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    2. DIVERSITY & INCLUSION
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MetricField label="Gender Ratio" value={formData.social.diversityInclusion.genderRatio.value} name="genderRatio" path="social.diversityInclusion" unit="ratio" onChange={handleChange} />
                                    <MetricField label="Minority Rep." value={formData.social.diversityInclusion.minorityRepresentation.value} name="minorityRepresentation" path="social.diversityInclusion" unit="%" onChange={handleChange} />
                                    <MetricField label="Disability Inclusion" value={formData.social.diversityInclusion.disabilityInclusion.value} name="disabilityInclusion" path="social.diversityInclusion" unit="%" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </details>

                    {/* Governance (G) Module */}
                    <details className="group mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                        <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-all outline-none">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-400">gavel</span>
                                Governance Protocol
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold uppercase">Section G</span>
                                <span className="material-symbols-outlined text-white transition-transform group-open:rotate-180">expand_more</span>
                            </div>
                        </summary>
                        <div className="p-6 border-t border-white/5 flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-400 mb-4 tracking-widest">A. CORPORATE GOVERNANCE</h3>
                                    <div className="space-y-4">
                                        <MetricField label="Board Size" value={formData.governance.corporate.boardSize.value} name="boardSize" path="governance.corporate" unit="qty" onChange={handleChange} />
                                        <MetricField label="Independent Directors" value={formData.governance.corporate.independentDirectors.value} name="independentDirectors" path="governance.corporate" unit="%" onChange={handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-blue-400 mb-4 tracking-widest">B. ETHICS & COMPLIANCE</h3>
                                    <div className="space-y-4">
                                        <MetricField label="Reported Violations" value={formData.governance.ethics.violations.value} name="violations" path="governance.ethics" unit="count" onChange={handleChange} />
                                        <MetricField label="Anti-Corruption Policy" value={formData.governance.ethics.antiCorruption.value} name="antiCorruption" path="governance.ethics" options={['yes', 'no']} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                    {/* Supporting Documentation */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 bg-sky-500/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-sky-300 text-lg">add</span>
                            </span>
                            Supporting Documentation
                        </h2>
                        <div
                            onDrop={handleDocDrop}
                            onDragOver={handleDocDragOver}
                            onDragLeave={handleDocDragLeave}
                            className="relative border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:border-white/30 transition-all py-12 px-6 flex flex-col items-center justify-center gap-3 min-h-[180px]"
                        >
                            <span className="material-symbols-outlined text-4xl text-white/40">cloud_upload</span>
                            <p className="text-white/80 text-sm font-medium">Drag and drop verification files here</p>
                            <p className="text-white/50 text-xs">PDF, XLS, or PNG (Max 15MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.xls,.xlsx,.png"
                                multiple
                                className="hidden"
                                onChange={(e) => { addSupportingDocs(e.target.files); e.target.value = '' }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-1 px-5 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white/90 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all"
                            >
                                Browse Files
                            </button>
                        </div>
                        {supportingDocs.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">Attached ({supportingDocs.length})</p>
                                {supportingDocs.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                                        <span className="text-sm text-white/90 truncate flex-1">{f.name}</span>
                                        <span className="text-[10px] text-white/50">{(f.size / 1024).toFixed(1)} KB</span>
                                        <button type="button" onClick={() => removeSupportingDoc(i)} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors" aria-label="Remove file">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {submitError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {submitError}
                        </div>
                    )}
                </form>
            </div>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-blue-300">
                        <div className={`w-2 h-2 rounded-full ${draftSaved ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
                        {draftSaved ? 'DRAFT SAVED' : 'NOT SAVED'}
                    </div>
                    <div className="flex gap-4">
                        {draftSaved && (
                            <Link
                                to="/drafts"
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-400/20 rounded-xl font-bold hover:bg-blue-600/30 transition-all animate-pulse"
                            >
                                <span className="material-symbols-outlined">description</span>
                                VIEW ALL DRAFTS
                            </Link>
                        )}
                        <button
                            onClick={handleSaveDraft}
                            className="px-6 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 transition-all font-sans"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 flex items-center gap-2 transition-all hover:scale-105"
                        >
                            {isSubmitting ? 'Processing...' : 'Review & Confirm'}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submit
