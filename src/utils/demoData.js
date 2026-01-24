// Demo data generator for hackathon presentation
// This provides realistic sample data to make the app look populated

export const generateDemoSubmissions = () => {
  const companies = [
    'EcoCorp Logistics', 'GreenTech Industries', 'Sustainable Solutions Inc',
    'CleanEnergy Co', 'EarthFirst Manufacturing', 'BioFuel Dynamics'
  ]

  const energySources = ['Solar Energy', 'Wind Power', 'Hydroelectric', 'Grid (Mixed)']

  const submissions = []
  const now = Date.now()

  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000)

    submissions.push({
      id: `demo-${i}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      recordHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: timestamp.toISOString(),
      network: 'ESGChain L2 Mainnet',
      blockNumber: 5000000 + Math.floor(Math.random() * 100000),
      gasUsed: `0.00${Math.floor(Math.random() * 99)}`,
      data: {
        companyName: companies[Math.floor(Math.random() * companies.length)],
        batchId: `ESG-2024-01-${String(i + 1).padStart(3, '0')}`,
        emissions: (Math.random() * 500 + 50).toFixed(2),
        energySource: energySources[Math.floor(Math.random() * energySources.length)]
      },
      success: true
    })
  }

  return submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const generateDemoVerifications = () => {
  const verifications = []
  const now = Date.now()

  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 20)
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000)

    verifications.push({
      id: `verify-${i}`,
      recordHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: timestamp.toISOString(),
      verified: true,
      data: {
        companyName: 'EcoCorp Logistics',
        batchId: `ESG-2024-01-${String(i + 1).padStart(3, '0')}`,
        emissions: (Math.random() * 300 + 50).toFixed(2),
        energySource: 'Solar Energy'
      }
    })
  }

  return verifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const getDemoStats = () => {
  return {
    totalFacilities: 42,
    activeOracles: 128,
    avgGridIntensity: 245,
    carbonOffsetCredit: 12450,
    totalVerified: 2847650,
    totalSubmissions: 1247,
    verifiedToday: 23,
    avgEmissions: 187.5,
    topPerformer: 'EcoCorp Logistics'
  }
}

export const getDemoChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return months.map(month => ({
    month,
    emissions: Math.floor(Math.random() * 500 + 200),
    target: 300,
    verified: Math.floor(Math.random() * 100 + 50)
  }))
}

export const getDemoCompanyRankings = () => {
  return [
    {
      rank: 1,
      company: 'EcoCorp Logistics',
      emissions: 1245.5,
      reduction: 23.5,
      verified: 156,
      score: 98
    },
    {
      rank: 2,
      company: 'GreenTech Industries',
      emissions: 1567.8,
      reduction: 18.2,
      verified: 142,
      score: 95
    },
    {
      rank: 3,
      company: 'Sustainable Solutions Inc',
      emissions: 1789.2,
      reduction: 15.7,
      verified: 128,
      score: 92
    },
    {
      rank: 4,
      company: 'CleanEnergy Co',
      emissions: 2012.4,
      reduction: 12.3,
      verified: 115,
      score: 89
    },
    {
      rank: 5,
      company: 'EarthFirst Manufacturing',
      emissions: 2345.6,
      reduction: 9.8,
      verified: 98,
      score: 85
    }
  ]
}

export const loadDemoDataIntoContext = (addSubmission, addVerification) => {
  const submissions = generateDemoSubmissions()
  const verifications = generateDemoVerifications()

  // Add a few submissions to context
  submissions.slice(0, 3).forEach(sub => addSubmission(sub))

  // Add a few verifications to context
  verifications.slice(0, 2).forEach(ver => addVerification(ver))
}
