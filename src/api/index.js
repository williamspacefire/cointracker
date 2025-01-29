import axios from 'axios'

const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
})

// Add response interceptor for rate limit handling
coingeckoApi.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 429) {
    // Rate limit reached, wait for 60 seconds before retrying
    await new Promise(resolve => setTimeout(resolve, 60000))
    return coingeckoApi.request(error.config)
  }
  return Promise.reject(error)
})

// Cache for storing API responses
const cache = new Map()

export async function getCryptoPrices() {
  try {
    // Check cache first
    const cachedData = cache.get('cryptoPrices')
    const cacheAge = cache.get('cryptoPricesTimestamp')
    const cacheIsValid = cacheAge && (Date.now() - cacheAge) < 30000 // 30 seconds cache

    if (cachedData && cacheIsValid) {
      return cachedData
    }

    const { data } = await coingeckoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        sparkline: true,
        price_change_percentage: '24h'
      }
    })

    // Update cache
    cache.set('cryptoPrices', data)
    cache.set('cryptoPricesTimestamp', Date.now())

    return data
  } catch (error) {
    console.error('API Error:', error)
    // If cache exists but is expired, return it as fallback
    const cachedData = cache.get('cryptoPrices')
    if (cachedData) {
      return cachedData
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch crypto prices. Please try again later.')
  }
}

export async function getCryptoDetail(id) {
  try {
    const cacheKey = `cryptoDetail-${id}`
    const cachedData = cache.get(cacheKey)
    const cacheAge = cache.get(`${cacheKey}-timestamp`)
    const cacheIsValid = cacheAge && (Date.now() - cacheAge) < 60000 // 1 minute cache

    if (cachedData && cacheIsValid) {
      return cachedData
    }

    const { data } = await coingeckoApi.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false
      }
    })

    cache.set(cacheKey, data)
    cache.set(`${cacheKey}-timestamp`, Date.now())

    return data
  } catch (error) {
    console.error('API Error:', error)
    const cachedData = cache.get(`cryptoDetail-${id}`)
    if (cachedData) {
      return cachedData
    }
    throw new Error('Failed to fetch crypto details. Please try again later.')
  }
}

export async function getCryptoHistory(id) {
  try {
    const cacheKey = `cryptoHistory-${id}`
    const cachedData = cache.get(cacheKey)
    const cacheAge = cache.get(`${cacheKey}-timestamp`)
    const cacheIsValid = cacheAge && (Date.now() - cacheAge) < 300000 // 5 minutes cache

    if (cachedData && cacheIsValid) {
      return cachedData
    }

    const { data } = await coingeckoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: 7,
        interval: 'daily'
      }
    })

    cache.set(cacheKey, data)
    cache.set(`${cacheKey}-timestamp`, Date.now())

    return data
  } catch (error) {
    console.error('API Error:', error)
    const cachedData = cache.get(`cryptoHistory-${id}`)
    if (cachedData) {
      return cachedData
    }
    throw new Error('Failed to fetch price history. Please try again later.')
  }
}

export async function getExchangeRates(base = 'USD') {
  try {
    const cacheKey = `exchangeRates-${base}`
    const cachedData = cache.get(cacheKey)
    const cacheAge = cache.get(`${cacheKey}-timestamp`)
    const cacheIsValid = cacheAge && (Date.now() - cacheAge) < 3600000 // 1 hour cache

    if (cachedData && cacheIsValid) {
      return cachedData
    }

    const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`)
    
    cache.set(cacheKey, data.rates)
    cache.set(`${cacheKey}-timestamp`, Date.now())

    return data.rates
  } catch (error) {
    console.error('API Error:', error)
    const cachedData = cache.get(`exchangeRates-${base}`)
    if (cachedData) {
      return cachedData
    }
    throw new Error('Failed to fetch exchange rates. Please try again later.')
  }
}
