import { QRCodeSVG } from 'qrcode.react'
import { getExplorerUrl } from '../utils/blockchain'
import { downloadPDFCertificate } from '../utils/pdfGenerator'

function VerificationCertificate({ submission, onClose }) {
  const isReal = submission.isRealBlockchain

  const handleDownloadPDF = () => {
    const proofData = {
      data: {
        companyName: submission.company,
        batchId: submission.recordHash || submission.txHash,
        emissions: submission.emissions,
        energySource: submission.formData?.industrySector || 'General'
      },
      network: isReal ? (submission.network || 'Sepolia Testnet') : 'Demo Mode (Local)',
      transactionHash: submission.txHash,
      recordHash: submission.recordHash,
      timestamp: submission.date
    }
    downloadPDFCertificate(proofData, `${submission.company}-ESG-Certificate.pdf`)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative">
        {/* Header Section */}
        <div className={`p-8 text-white text-center relative ${isReal ? 'bg-gradient-to-br from-emerald-600/20 to-blue-600/20' : 'bg-gradient-to-br from-blue-600/20 to-slate-800/20'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3">
            <span className={`material-symbols-outlined ${isReal ? 'text-emerald-600' : 'text-blue-600'} text-4xl font-black`}>
              {isReal ? 'verified' : 'fact_check'}
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-1">ESG DATA PROOF</h2>
          <p className="text-blue-300 text-sm font-bold uppercase tracking-widest opacity-80">Blockchain Verified Certificate</p>
        </div>

        <div className="p-8">
          {/* ESG Disclosure Label (Nutrition Style) */}
          <div className="bg-white border-[6px] border-black p-4 text-black font-sans shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] mb-10">
            <h3 className="text-4xl font-black border-b-[10px] border-black pb-1 mb-2 tracking-tighter leading-none">ESG Disclosure</h3>
            <div className="flex justify-between border-b-2 border-black py-1 font-black text-xs uppercase">
              <span>Reporting Entity</span>
              <span>{submission.company}</span>
            </div>
            <div className="flex justify-between border-b-[6px] border-black py-1 font-black text-xs uppercase mb-4">
              <span>Reporting Period</span>
              <span>{submission.formData?.reportingYear || '2024'}</span>
            </div>

            {/* ENVIRONMENTAL SECTION */}
            <div className="border-b-[10px] border-black mb-3">
              <div className="flex justify-between items-end mb-1">
                <span className="text-2xl font-black tracking-tighter">ENVIRONMENTAL</span>
                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 mb-1 ml-2">CAT-E</span>
              </div>
              <div className="space-y-0.5 pb-2">
                <div className="flex justify-between border-t-2 border-black py-1 text-sm font-black">
                  <span>Scope 1 Emissions</span>
                  <span>{submission.formData?.scope1Emissions?.value || submission.emissions} tCO2e</span>
                </div>
                <div className="flex justify-between border-t border-black py-1 text-sm font-bold pl-4">
                  <span>Scope 2 Emissions</span>
                  <span>{submission.formData?.scope2Emissions?.value || '0'} tCO2e</span>
                </div>
                {submission.formData?.additionalEnvironmental?.map((p, i) => (
                  <div key={i} className="flex justify-between border-t border-black py-1 text-xs font-medium pl-4">
                    <span>{p.type} Emission</span>
                    <span>{p.quantity} {p.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SOCIAL SECTION */}
            <div className="border-b-[10px] border-black mb-3">
              <div className="flex justify-between items-end mb-1">
                <span className="text-2xl font-black tracking-tighter">SOCIAL IMPACT</span>
                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 mb-1 ml-2">CAT-S</span>
              </div>
              <div className="space-y-0.5 pb-2">
                <div className="flex justify-between border-t-2 border-black py-1 text-sm font-black">
                  <span>Gender Pay Gap</span>
                  <span>{submission.formData?.social?.employeeWelfare?.genderPayGap?.value || 'N/A'}%</span>
                </div>
                <div className="flex justify-between border-t border-black py-1 text-sm font-bold pl-4">
                  <span>Employee Turnover</span>
                  <span>{submission.formData?.social?.employeeWelfare?.turnoverRate?.value || 'N/A'}%</span>
                </div>
                <div className="flex justify-between border-t border-black py-1 text-sm font-bold pl-4">
                  <span>Minority Representation</span>
                  <span>{submission.formData?.social?.diversityInclusion?.minorityRepresentation?.value || 'N/A'}%</span>
                </div>
              </div>
            </div>

            {/* GOVERNANCE SECTION */}
            <div className="border-b-[6px] border-black mb-4">
              <div className="flex justify-between items-end mb-1">
                <span className="text-2xl font-black tracking-tighter">GOVERNANCE</span>
                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 mb-1 ml-2">CAT-G</span>
              </div>
              <div className="space-y-0.5 pb-2">
                <div className="flex justify-between border-t-2 border-black py-1 text-sm font-black">
                  <span>Independent Board</span>
                  <span>{submission.formData?.governance?.corporate?.independentDirectors?.value || 'N/A'}%</span>
                </div>
                <div className="flex justify-between border-t border-black py-1 text-sm font-bold pl-4">
                  <span>Audit Frequency</span>
                  <span>{submission.formData?.governance?.transparency?.auditFrequency?.value || 'Periodic'}</span>
                </div>
              </div>
            </div>

            <p className="text-[9px] leading-none mb-1 font-bold uppercase">Ingredients: Transparency, Accountability, Blockchain Integrity.</p>
            <p className="text-[8px] leading-tight opacity-70 italic font-medium">
              * Claimed values are self-reported by the entity. Blockchain anchoring hash provides proof of existence at the time of report. Verification status available on explorer.
            </p>
          </div>

          {/* Technical Proofs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">On-Chain Evidence</label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-black/40 text-blue-300 p-2 rounded text-[10px] border border-white/10 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {submission.txHash}
                  </code>
                  {isReal && (
                    <a href={getExplorerUrl(submission.txHash)} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Network</label>
                  <span className="text-white text-xs font-bold">{isReal ? (submission.network || 'Sepolia') : 'Local Demo'}</span>
                </div>
                <div>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Status</label>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black ${isReal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-200'}`}>
                    {isReal ? 'ANCHORED' : 'REGISTERED'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border-4 border-black">
              <QRCodeSVG
                value={isReal ? submission.txHash : `DEMO-${submission.company}`}
                size={120}
                level="H"
              />
              <p className="text-[8px] font-black text-black mt-2 font-mono uppercase">Scan to Verify Record</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-4 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span className="material-symbols-outlined">download</span>
              DOWNLOAD PDF
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-black text-sm hover:bg-white/10 transition-all uppercase"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationCertificate
