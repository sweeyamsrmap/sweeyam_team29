import { ethers } from 'ethers'

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "function submitESGData(string memory _companyName, string memory _batchId, uint256 _emissions, string memory _energySource) public returns (bytes32)",
  "function verifyESGData(bytes32 _recordHash) public view returns (bool exists, string memory companyName, string memory batchId, uint256 emissions, string memory energySource, uint256 timestamp, address submitter)",
  "function getTotalRecords() public view returns (uint256)",
  "function mintCertificate(bytes32 _recordHash, string memory _companyName) public returns (uint256)",
  "function getCertificate(uint256 _certificateId) public view returns (uint256 id, string memory companyName, uint256 totalEmissions, uint256 recordCount, uint256 mintedAt, address owner, string memory achievementLevel)",
  "function getCompanyCertificates(address _company) public view returns (uint256[] memory)",
  "function getCompanyStats(address _company) public view returns (uint256 totalEmissions, uint256 recordCount)",
  "event ESGDataSubmitted(bytes32 indexed recordHash, string companyName, string batchId, uint256 emissions, string energySource, uint256 timestamp, address submitter)",
  "event CertificateMinted(uint256 indexed certificateId, address indexed owner, string companyName, string achievementLevel, uint256 totalEmissions, uint256 recordCount)"
]

// Network configurations
const NETWORKS = {
  // Polygon Mumbai Testnet (Free testnet)
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  // Polygon Mainnet (Production)
  polygon: {
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  // Sepolia Testnet (Ethereum testnet)
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
}

// Use Sepolia testnet by default (easy to get test ETH)
const CURRENT_NETWORK = NETWORKS.sepolia

// Contract address (deploy your contract and update this)
// For demo, we'll use a placeholder - you need to deploy the contract first
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

/**
 * Connect to MetaMask wallet
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.')
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    })
    
    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    
    if (chainId !== CURRENT_NETWORK.chainId) {
      // Try to switch to the correct network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CURRENT_NETWORK.chainId }],
        })
      } catch (switchError) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CURRENT_NETWORK.chainId,
              chainName: CURRENT_NETWORK.chainName,
              rpcUrls: [CURRENT_NETWORK.rpcUrl],
              blockExplorerUrls: [CURRENT_NETWORK.blockExplorer],
              nativeCurrency: CURRENT_NETWORK.nativeCurrency
            }]
          })
        } else {
          throw switchError
        }
      }
    }
    
    return accounts[0]
  } catch (error) {
    console.error('Error connecting wallet:', error)
    throw error
  }
}

/**
 * Get provider and signer
 */
export const getProviderAndSigner = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  
  return { provider, signer }
}

/**
 * Get contract instance
 */
export const getContract = async () => {
  const { signer } = await getProviderAndSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

/**
 * Submit ESG data to blockchain
 */
export const submitESGData = async (data) => {
  try {
    const contract = await getContract()
    
    // Convert emissions to integer (multiply by 100 to preserve 2 decimals)
    const emissionsInt = Math.floor(parseFloat(data.emissions) * 100)
    
    // Submit transaction
    const tx = await contract.submitESGData(
      data.companyName,
      data.batchId,
      emissionsInt,
      data.energySource
    )
    
    // Wait for transaction to be mined
    const receipt = await tx.wait()
    
    // Get the record hash from the event
    const event = receipt.events?.find(e => e.event === 'ESGDataSubmitted')
    const recordHash = event?.args?.recordHash
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      recordHash: recordHash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString(),
      network: CURRENT_NETWORK.chainName,
      gasUsed: ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)),
      data
    }
  } catch (error) {
    console.error('Error submitting ESG data:', error)
    throw error
  }
}

/**
 * Verify ESG data on blockchain
 */
export const verifyESGData = async (recordHash) => {
  try {
    const contract = await getContract()
    
    // Call the verify function
    const result = await contract.verifyESGData(recordHash)
    
    if (!result.exists) {
      return {
        success: false,
        verified: false,
        message: 'Record not found on blockchain'
      }
    }
    
    return {
      success: true,
      verified: true,
      recordHash: recordHash,
      timestamp: new Date(result.timestamp.toNumber() * 1000).toISOString(),
      network: CURRENT_NETWORK.chainName,
      data: {
        companyName: result.companyName,
        batchId: result.batchId,
        emissions: (result.emissions.toNumber() / 100).toFixed(2),
        energySource: result.energySource,
        submitter: result.submitter
      }
    }
  } catch (error) {
    console.error('Error verifying ESG data:', error)
    throw error
  }
}

/**
 * Get current network info
 */
export const getNetworkInfo = () => {
  return {
    name: CURRENT_NETWORK.chainName,
    chainId: CURRENT_NETWORK.chainId,
    explorer: CURRENT_NETWORK.blockExplorer,
    currency: CURRENT_NETWORK.nativeCurrency.symbol
  }
}

/**
 * Get transaction explorer URL
 */
export const getExplorerUrl = (txHash) => {
  return `${CURRENT_NETWORK.blockExplorer}/tx/${txHash}`
}

/**
 * Mint NFT certificate for ESG record
 */
export const mintCertificate = async (recordHash, companyName) => {
  try {
    const contract = await getContract()

    const tx = await contract.mintCertificate(recordHash, companyName)
    const receipt = await tx.wait()

    // Get certificate ID from event
    const event = receipt.events?.find(e => e.event === 'CertificateMinted')
    const certificateId = event?.args?.certificateId

    return {
      success: true,
      certificateId: certificateId.toNumber(),
      transactionHash: receipt.transactionHash,
      achievementLevel: event?.args?.achievementLevel
    }
  } catch (error) {
    console.error('Error minting certificate:', error)
    throw error
  }
}

/**
 * Get certificate details
 */
export const getCertificate = async (certificateId) => {
  try {
    const contract = await getContract()
    const result = await contract.getCertificate(certificateId)

    return {
      id: result.id.toNumber(),
      companyName: result.companyName,
      totalEmissions: (result.totalEmissions.toNumber() / 100).toFixed(2),
      recordCount: result.recordCount.toNumber(),
      mintedAt: new Date(result.mintedAt.toNumber() * 1000).toISOString(),
      owner: result.owner,
      achievementLevel: result.achievementLevel
    }
  } catch (error) {
    console.error('Error getting certificate:', error)
    throw error
  }
}

/**
 * Get company certificates
 */
export const getCompanyCertificates = async (address) => {
  try {
    const contract = await getContract()
    const certificateIds = await contract.getCompanyCertificates(address)
    return certificateIds.map(id => id.toNumber())
  } catch (error) {
    console.error('Error getting company certificates:', error)
    throw error
  }
}

/**
 * Get company stats
 */
export const getCompanyStats = async (address) => {
  try {
    const contract = await getContract()
    const result = await contract.getCompanyStats(address)

    return {
      totalEmissions: (result.totalEmissions.toNumber() / 100).toFixed(2),
      recordCount: result.recordCount.toNumber()
    }
  } catch (error) {
    console.error('Error getting company stats:', error)
    throw error
  }
}
