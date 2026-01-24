// Carbon Intensity API Integration
// Using CO2 Signal API (free tier available) and fallback data

const CO2_SIGNAL_API_KEY = import.meta.env.VITE_CO2_SIGNAL_API_KEY || ''

/**
 * Get carbon intensity for a specific location
 * @param {string} countryCode - ISO country code (e.g., 'US', 'IN', 'CN')
 * @returns {Promise<Object>} Carbon intensity data
 */
export const getCarbonIntensity = async (countryCode = 'US') => {
  // If no API key, return mock data
  if (!CO2_SIGNAL_API_KEY) {
    return getMockCarbonIntensity(countryCode)
  }

  try {
    const response = await fetch(
      `https://api.co2signal.com/v1/latest?countryCode=${countryCode}`,
      {
        headers: {
          'auth-token': CO2_SIGNAL_API_KEY
        }
      }
    )

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()

    return {
      carbonIntensity: data.data.carbonIntensity,
      fossilFuelPercentage: data.data.fossilFuelPercentage,
      renewablePercentage: 100 - data.data.fossilFuelPercentage,
      country: countryCode,
      timestamp: data.data.datetime,
      unit: 'gCO2eq/kWh'
    }
  } catch (error) {
    console.error('Error fetching carbon intensity:', error)
    return getMockCarbonIntensity(countryCode)
  }
}

/**
 * Get mock carbon intensity data for demo purposes
 */
export const getMockCarbonIntensity = (countryCode) => {
  const mockData = {
    'US': {
      carbonIntensity: 417,
      fossilFuelPercentage: 60.2,
      renewablePercentage: 39.8,
      country: 'United States',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'IN': {
      carbonIntensity: 708,
      fossilFuelPercentage: 74.3,
      renewablePercentage: 25.7,
      country: 'India',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'CN': {
      carbonIntensity: 555,
      fossilFuelPercentage: 65.8,
      renewablePercentage: 34.2,
      country: 'China',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'DE': {
      carbonIntensity: 338,
      fossilFuelPercentage: 45.2,
      renewablePercentage: 54.8,
      country: 'Germany',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'GB': {
      carbonIntensity: 233,
      fossilFuelPercentage: 38.5,
      renewablePercentage: 61.5,
      country: 'United Kingdom',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'FR': {
      carbonIntensity: 85,
      fossilFuelPercentage: 12.3,
      renewablePercentage: 87.7,
      country: 'France',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    },
    'NL': {
      carbonIntensity: 395,
      fossilFuelPercentage: 52.1,
      renewablePercentage: 47.9,
      country: 'Netherlands',
      timestamp: new Date().toISOString(),
      unit: 'gCO2eq/kWh'
    }
  }

  return mockData[countryCode] || mockData['US']
}

/**
 * Get global carbon intensity statistics
 */
export const getGlobalCarbonStats = async () => {
  const countries = ['US', 'IN', 'CN', 'DE', 'GB', 'FR', 'NL']
  const data = await Promise.all(
    countries.map(code => getCarbonIntensity(code))
  )

  const avgIntensity = data.reduce((sum, d) => sum + d.carbonIntensity, 0) / data.length
  const avgRenewable = data.reduce((sum, d) => sum + d.renewablePercentage, 0) / data.length

  return {
    averageCarbonIntensity: Math.round(avgIntensity),
    averageRenewablePercentage: Math.round(avgRenewable),
    countries: data,
    timestamp: new Date().toISOString()
  }
}

/**
 * Calculate emissions based on energy consumption and location
 * @param {number} energyKwh - Energy consumption in kWh
 * @param {string} countryCode - ISO country code
 * @returns {Promise<Object>} Calculated emissions
 */
export const calculateEmissions = async (energyKwh, countryCode = 'US') => {
  const intensityData = await getCarbonIntensity(countryCode)

  // Convert gCO2eq/kWh to tCO2e
  const emissionsTonnes = (energyKwh * intensityData.carbonIntensity) / 1000000

  return {
    emissions: emissionsTonnes.toFixed(3),
    energyKwh: energyKwh,
    carbonIntensity: intensityData.carbonIntensity,
    country: intensityData.country,
    unit: 'tCO2e',
    breakdown: {
      fossil: (emissionsTonnes * intensityData.fossilFuelPercentage / 100).toFixed(3),
      renewable: (emissionsTonnes * intensityData.renewablePercentage / 100).toFixed(3)
    }
  }
}

/**
 * Get energy source recommendations based on location
 */
export const getEnergyRecommendations = async (countryCode = 'US') => {
  const intensityData = await getCarbonIntensity(countryCode)

  const recommendations = []

  if (intensityData.fossilFuelPercentage > 50) {
    recommendations.push({
      type: 'Solar Energy',
      potentialReduction: '60-80%',
      priority: 'High',
      description: 'Install solar panels to significantly reduce carbon footprint'
    })
    recommendations.push({
      type: 'Wind Power',
      potentialReduction: '70-90%',
      priority: 'High',
      description: 'Consider wind energy contracts or on-site turbines'
    })
  }

  if (intensityData.carbonIntensity > 400) {
    recommendations.push({
      type: 'Energy Efficiency',
      potentialReduction: '20-40%',
      priority: 'Medium',
      description: 'Implement energy efficiency measures to reduce overall consumption'
    })
  }

  recommendations.push({
    type: 'Carbon Offsets',
    potentialReduction: '100%',
    priority: 'Low',
    description: 'Purchase verified carbon offsets as a complementary measure'
  })

  return {
    currentIntensity: intensityData.carbonIntensity,
    recommendations,
    country: intensityData.country
  }
}
