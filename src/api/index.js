import axios from 'axios'

const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 120000,
})

// Simple cache implementation
const cache = {
  data: new Map(),
  timestamps: new Map(),
  set(key, value, ttl = 100000) {
    // Ensure data is deeply cloned, if necessary
    this.data.set(key, JSON.parse(JSON.stringify(value)))
    this.timestamps.set(key, Date.now() + ttl)
  },
  get(key) {
    if (this.timestamps.get(key) > Date.now()) {
      return this.data.get(key)
    }
    this.data.delete(key)
    this.timestamps.delete(key)
    return null
  }
}

// Helper to normalize currency input
const normalizeCurrency = (currency) => {
  if (typeof currency === 'object' && currency !== null) {
    return (currency.code || 'usd').toLowerCase()
  }
  return String(currency || 'usd').toLowerCase()
}

// Helper to fetch data with cache handling
const fetchWithCache = async (cacheKey, ttl, fetcher) => {
  const cachedData = cache.get(cacheKey)
  if (cachedData) return cachedData
  const data = await fetcher()
  cache.set(cacheKey, data, ttl)
  return data
}

export async function getCryptoPrices(currency = 'usd') {
  const normalizedCurrency = normalizeCurrency(currency)
  const cacheKey = `cryptoPrices-${normalizedCurrency}`
  try {
    return await fetchWithCache(cacheKey, 100000, async () => {
      const { data } = await coingeckoApi.get('/coins/markets', {
        params: {
          vs_currency: normalizedCurrency,
          order: 'market_cap_desc',
          per_page: 50,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      })

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid API response format')
      }
      return data
    })
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      currency
    })
    return [] // Return empty array instead of throwing
  }
}

export async function getCryptoDetail(id, currency = 'usd') {
  const normalizedCurrency = normalizeCurrency(currency)
  const cacheKey = `cryptoDetail-${id}-${normalizedCurrency}`
  try {
    return await fetchWithCache(cacheKey, 60000, async () => {
      const { data } = await coingeckoApi.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
          market_data: true,
          vs_currency: normalizedCurrency
        }
      })

      if (!data) {
        throw new Error('No data received from API')
      }
      return data
    })
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      id,
      currency
    })
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a minute.')
    }
    throw new Error(`Failed to fetch crypto details: ${error.message}`)
  }
}

export async function getCryptoHistory(id, currency = 'usd') {
  const normalizedCurrency = normalizeCurrency(currency)
  const cacheKey = `cryptoHistory-${id}-${normalizedCurrency}`
  try {
    return await fetchWithCache(cacheKey, 300000, async () => {
      const { data } = await coingeckoApi.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: normalizedCurrency,
          days: 7,
          interval: 'daily'
        }
      })

      if (!data) {
        throw new Error('No data received from API')
      }
      return data
    })
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      id,
      currency
    })
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a minute.')
    }
    throw new Error(`Failed to fetch price history: ${error.message}`)
  }
}

export async function getExchangeRates(base = 'USD') {
  const cacheKey = `exchangeRates-${base}`
  try {
    return await fetchWithCache(cacheKey, 3600000, async () => {
      const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`)
      return data.rates
    })
  } catch (error) {
    console.error('API Error:', error.message)
    throw new Error('Failed to fetch exchange rates. Please try again later.')
  }
}
