import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function downloadPDFCertificate(proofData, filename = 'ESGChain-Certificate.pdf') {
  const doc = new jsPDF()
  const isReal = proofData.network && !proofData.network.includes('Demo')

  // Add header
  doc.setFillColor(isReal ? 16 : 37, isReal ? 185 : 99, isReal ? 129 : 235) // Emerald for real, Blue for demo
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('ESGChain Certificate', 105, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.text(isReal ? 'Blockchain-Verified ESG Data' : 'Digital ESG Data Record (Demo Mode)', 105, 30, { align: 'center' })

  // Reset text color
  doc.setTextColor(0, 0, 0)

  // Add content
  doc.setFontSize(14)
  doc.text('Verification Details', 20, 55)

  const data = proofData.data || proofData

  // Create table
  doc.autoTable({
    startY: 65,
    head: [['Field', 'Value']],
    body: [
      ['Company Name', data.companyName || 'N/A'],
      ['Batch ID', data.batchId || 'N/A'],
      ['Carbon Emissions', `${data.emissions || 'N/A'} tCO2e`],
      ['Energy Source', data.energySource || 'N/A'],
      ['Network', proofData.network || 'Mock Blockchain'],
      [isReal ? 'Transaction Hash' : 'Internal Ref. ID', proofData.transactionHash || proofData.recordHash || 'N/A'],
      ['Timestamp', new Date(proofData.timestamp).toLocaleString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: isReal ? [16, 185, 129] : [37, 99, 235] },
  })

  // Add footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text(
    isReal
      ? 'This certificate is cryptographically verified on the blockchain'
      : 'This is a demo certificate for preview purposes only',
    105, pageHeight - 20, { align: 'center' }
  )
  doc.text('Powered by ESGChain', 105, pageHeight - 10, { align: 'center' })

  // Save the PDF
  doc.save(filename)
}
