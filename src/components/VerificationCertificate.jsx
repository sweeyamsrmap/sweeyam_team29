import { QRCodeSVG } from 'qrcode.react'
import { getExplorerUrl } from '../utils/blockchain'
import { downloadPDFCertificate } from '../utils/pdfGenerator'

function VerificationCertificate({ submission, onClose }) {
  const handleDownloadPDF = () => {
    const proofData = {
      data: {
        companyName: submission.company,
        batchId: submission.recordHash || submission.txHash,
        emissions: submission.emissions,
        energySource: submission.formData?.industrySector || 'General'
      },
      network: submission.network || 'Sepolia Testnet',
      transactionHash: submission.txHash,
      recordHash: submission.recordHash,
      timestamp: submission.date
    }

    downloadPDFCertificate(proofData, `${submission.company}-ESG-Certificate.pdf`)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">verified</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">ESG Verification Certificate</h2>
            <p className="text-emerald-100">Blockchain-Verified Environmental Data</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-xl border-4 border-emerald-600 shadow-lg shadow-emerald-500/50">
              <QRCodeSVG
                value={submission.txHash}
                size={200}
                level="H"
                includeMargin={true}
              />
              <p className="text-center text-xs text-slate-600 mt-2">Scan to verify • TX: {submission.txHash?.slice(0, 10)}...</p>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">business</span>
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-300">Company Name</p>
                  <p className="font-semibold text-white">{submission.company}</p>
                </div>
                <div>
                  <p className="text-blue-300">Industry Sector</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.industrySector || 'General'}
                  </p>
                </div>
                <div>
                  <p className="text-blue-300">Reporting Year</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.reportingYear || '2024'}
                  </p>
                </div>
                <div>
                  <p className="text-blue-300">Registration ID</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.registrationId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">eco</span>
                Environmental Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-300">Total Emissions</p>
                  <p className="font-semibold text-white">{submission.emissions} tonnes CO2e</p>
                </div>
                <div>
                  <p className="text-blue-300">Scope 1 Emissions</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.scope1Emissions || 'N/A'} tonnes CO2e
                  </p>
                </div>
                <div>
                  <p className="text-blue-300">Scope 2 Emissions</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.scope2Emissions || 'N/A'} tonnes CO2e
                  </p>
                </div>
                <div>
                  <p className="text-blue-300">Energy Usage</p>
                  <p className="font-semibold text-white">
                    {submission.formData?.totalEnergyUsage || 'N/A'} MWh
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400">link</span>
                Blockchain Verification
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-blue-300 mb-1">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white/5 px-3 py-2 rounded border border-white/20 text-xs font-mono text-blue-300">
                      {submission.txHash}
                    </code>
                    <a
                      href={getExplorerUrl(submission.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 shadow-lg shadow-blue-500/30"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-300">Network</p>
                    <p className="font-semibold text-white">{submission.network}</p>
                  </div>
                  <div>
                    <p className="text-blue-300">Block Number</p>
                    <p className="font-semibold text-white">{submission.blockNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-blue-300">Verification Date</p>
                    <p className="font-semibold text-white">{submission.date}</p>
                  </div>
                </div>
              </div>
            </div>

            {submission.certificateId && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-400/50">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-400">workspace_premium</span>
                  NFT Certificate
                </h3>
                <p className="text-sm text-yellow-200 mb-2">
                  This submission has been minted as an NFT certificate.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-300">Certificate ID:</span>
                  <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-yellow-200">
                    #{submission.certificateId}
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <span className="material-symbols-outlined">download</span>
              Download PDF Certificate
            </button>
            <a
              href={getExplorerUrl(submission.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              View on Blockchain
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 backdrop-blur-md px-8 py-4 text-center text-sm text-blue-200 border-t border-white/20">
          <p>This certificate is cryptographically verified on the Ethereum blockchain</p>
          <p className="text-xs mt-1 text-blue-300">Powered by ESGChain • Immutable • Transparent • Verifiable</p>
        </div>
      </div>
    </div>
  )
}

export default VerificationCertificate
