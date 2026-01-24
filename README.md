# ESGChain 🌍⛓️

> Blockchain-powered ESG data verification platform for transparent and immutable environmental reporting

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Polygon](https://img.shields.io/badge/Polygon-Mumbai-8247E5)](https://mumbai.polygonscan.com/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636)](https://soliditylang.org/)

## 🎯 Problem Statement

**68% of companies exaggerate their ESG claims**, leading to widespread greenwashing and loss of consumer trust. Traditional ESG reporting lacks transparency, is easily manipulated, and cannot be independently verified.

## 💡 Solution

ESGChain leverages blockchain technology to create an **immutable, transparent, and publicly verifiable** ESG data platform. Every environmental claim is cryptographically secured and can be verified by anyone, anywhere.

## ✨ Key Features

### 🔐 Blockchain Verification
- Immutable data storage on Polygon blockchain
- Cryptographic proof of authenticity
- Transparent transaction history

### 📱 QR Code Verification
- Instant verification via smartphone
- No technical knowledge required
- Shareable public verification links

### 🏆 NFT Achievement Certificates
- Mint NFT certificates for ESG milestones
- Tiered achievement system (Bronze → Platinum)
- Tradeable and displayable on OpenSea

### 🔗 Supply Chain Transparency
- End-to-end supply chain tracking
- Interactive flow visualization
- Blockchain-verified at each step

### 🌍 Live Carbon Intensity Data
- Real-time grid carbon intensity
- Country-specific energy mix
- Data-driven decision making

### 📄 PDF Certificates
- Professional certificate generation
- Downloadable and shareable
- Includes blockchain proof

### 🔓 Public Verification
- No wallet required for verification
- Accessible to all stakeholders
- Removes Web3 barriers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd esgchain-dashboard

# Run setup script
# Windows:
setup.bat

# Mac/Linux:
chmod +x setup.sh
./setup.sh

# Or manually:
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📋 Smart Contract Deployment

### Quick Deploy with Remix (5 minutes)

1. **Open Remix IDE**: https://remix.ethereum.org/

2. **Create Contract**:
   - New file: `ESGChainWithNFT.sol`
   - Copy code from `contracts/ESGChainWithNFT.sol`

3. **Compile**:
   - Solidity version: 0.8.19
   - Click "Compile"

4. **Deploy**:
   - Environment: "Injected Provider - MetaMask"
   - Network: Polygon Mumbai
   - Click "Deploy"
   - Confirm in MetaMask

5. **Update Config**:
   - Copy contract address
   - Update `.env`: `VITE_CONTRACT_ADDRESS=0xYourAddress`
   - Restart dev server

### Get Test MATIC
- Visit: https://faucet.polygon.technology/
- Select "Mumbai" network
- Enter your wallet address
- Receive free test MATIC

## 🏗️ Project Structure

```
esgchain-dashboard/
├── contracts/
│   ├── ESGChain.sol              # Basic smart contract
│   └── ESGChainWithNFT.sol       # Enhanced contract with NFTs
├── src/
│   ├── components/
│   │   ├── BlockchainProof.jsx   # Proof display with QR
│   │   ├── NFTCertificate.jsx    # NFT minting component
│   │   ├── QRCodeDisplay.jsx     # QR code generator
│   │   ├── CarbonIntensityWidget.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── PublicVerification.jsx # Public verify page
│   │   ├── SupplyChainMap.jsx    # Supply chain tracking
│   │   └── ...
│   ├── utils/
│   │   ├── blockchain.js         # Blockchain interactions
│   │   ├── pdfGenerator.js       # PDF certificate gen
│   │   ├── carbonIntensity.js    # Carbon API integration
│   │   └── mockBlockchain.js     # Mock for testing
│   └── context/
│       └── AppContext.jsx        # Global state
├── .env.example                  # Environment template
├── HACKATHON_GUIDE.md           # Detailed demo guide
├── README_BLOCKCHAIN.md         # Blockchain setup
└── package.json
```

## 🎮 Usage

### Submit ESG Data
1. Navigate to Dashboard
2. Fill in company details and emissions
3. Click "Generate Blockchain Proof"
4. Confirm transaction in MetaMask
5. View proof with QR code

### Verify Data
1. Scan QR code or visit verification link
2. View all verified data on blockchain
3. Download PDF certificate
4. Share with stakeholders

### Mint NFT Certificate
1. Submit multiple ESG records
2. Scroll to NFT Certificate section
3. Click "Mint NFT Certificate"
4. Receive achievement-based NFT

### Track Supply Chain
1. Navigate to "Supply Chain Map"
2. Click on nodes to view details
3. See blockchain verification for each step

## 🛠️ Technology Stack

### Blockchain
- **Network**: Polygon Mumbai Testnet
- **Smart Contracts**: Solidity 0.8.19
- **Wallet**: MetaMask integration
- **Library**: ethers.js v5

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 3.4.1
- **Routing**: React Router 7.13.0
- **Charts**: Recharts 3.7.0
- **QR Codes**: qrcode.react
- **PDF**: jsPDF + jspdf-autotable

### APIs & Integrations
- Carbon Intensity API (CO2 Signal)
- MetaMask Web3 Provider
- IPFS (future integration)

## 📊 Smart Contract Features

### ESGChainWithNFT.sol

```solidity
// Submit ESG data
function submitESGData(
    string memory _companyName,
    string memory _batchId,
    uint256 _emissions,
    string memory _energySource
) public returns (bytes32)

// Mint achievement NFT
function mintCertificate(
    bytes32 _recordHash,
    string memory _companyName
) public returns (uint256)

// Verify data
function verifyESGData(bytes32 _recordHash)
    public view returns (...)

// Get company stats
function getCompanyStats(address _company)
    public view returns (uint256, uint256)
```

## 🎯 Hackathon Demo Flow

1. **Introduction** (30s): Problem statement
2. **Submit Data** (30s): Generate blockchain proof
3. **QR Verification** (20s): Scan and verify
4. **Public Link** (30s): Show public verification
5. **NFT Certificate** (45s): Mint achievement NFT
6. **Supply Chain** (45s): Interactive tracking
7. **Carbon Data** (30s): Live intensity widget

**Total Demo Time**: ~4 minutes

See [HACKATHON_GUIDE.md](./HACKATHON_GUIDE.md) for detailed demo script.

## 🌟 Why ESGChain Wins

### Innovation
- ✅ First-of-its-kind NFT certificates for ESG
- ✅ QR code verification for mass adoption
- ✅ Supply chain transparency solution

### Technical Excellence
- ✅ Production-ready smart contracts
- ✅ Clean, modular architecture
- ✅ Real API integrations

### User Experience
- ✅ Intuitive interface
- ✅ No-wallet public verification
- ✅ Mobile-friendly design

### Real-World Impact
- ✅ Solves actual greenwashing problem
- ✅ Scalable to enterprise level
- ✅ Accessible to all stakeholders

## 📈 Metrics

- **Transaction Cost**: ~$0.001 per submission
- **Verification Time**: < 2 seconds
- **Carbon Footprint**: 99% less than Ethereum
- **Scalability**: 7,000+ TPS on Polygon
- **Accessibility**: Works on any device

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core blockchain verification
- ✅ NFT certificates
- ✅ QR code verification
- ✅ Supply chain tracking

### Phase 2 (Q2 2024)
- [ ] IoT sensor integration
- [ ] Oracle network for automated verification
- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations

### Phase 3 (Q3 2024)
- [ ] Multi-chain support (Ethereum, BSC)
- [ ] Advanced analytics dashboard
- [ ] AI-powered anomaly detection
- [ ] Enterprise features

### Phase 4 (Q4 2024)
- [ ] DAO governance
- [ ] Token economics
- [ ] Marketplace for carbon credits
- [ ] Global expansion

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Polygon for low-cost, eco-friendly blockchain
- MetaMask for seamless Web3 integration
- CO2 Signal for carbon intensity data
- OpenZeppelin for secure smart contract patterns

## 📞 Contact & Support

- **Documentation**: See [HACKATHON_GUIDE.md](./HACKATHON_GUIDE.md)
- **Blockchain Setup**: See [README_BLOCKCHAIN.md](./README_BLOCKCHAIN.md)
- **Issues**: Open an issue on GitHub
- **Demo**: [Live Demo Link]

## 🏆 Built For Hackathon

This project was built with ❤️ for [Hackathon Name]. We believe in a transparent, sustainable future powered by blockchain technology.

---

**Made with 🌍 by the ESGChain Team**

*Eliminating greenwashing, one block at a time.*
