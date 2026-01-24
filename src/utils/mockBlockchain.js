// Mock blockchain utilities
export const generateTransactionHash = () => {
  const chars = '0123456789abcdef'
  let hash = '0x'
  // Ethereum transaction hashes are 64 hex characters (32 bytes)
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

export const generateBatchId = () => {
  const prefix = 'ESG'
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${year}-${month}-${random}`
}

export const mockBlockchainSubmit = async (data) => {
  // Simulate network delay (quick for demo)
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true,
    transactionHash: generateTransactionHash(),
    recordHash: generateTransactionHash(),
    timestamp: new Date().toISOString(),
    network: 'Sepolia Testnet',
    blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
    gasUsed: '0.00' + Math.floor(Math.random() * 99),
    data
  }
}

export const mockVerifyProof = async (hash) => {
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Check if hash format is valid (64 hex chars after 0x = 66 total)
  if (!hash.startsWith('0x') || hash.length !== 66) {
    return {
      success: false,
      verified: false,
      message: 'Invalid transaction hash format'
    }
  }

  return {
    success: true,
    verified: true,
    transactionHash: hash,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    network: 'ESGChain L2 Mainnet',
    data: {
      companyName: 'EcoCorp Logistics',
      batchId: generateBatchId(),
      emissions: (Math.random() * 1000).toFixed(2),
      energySource: 'Solar Energy'
    }
  }
}
