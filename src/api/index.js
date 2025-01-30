import axios from 'axios'

const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 60000,
})

// Simple cache implementation
const cache = {
  data: new Map(),
  timestamps: new Map(),
  set: function(key, value, ttl = 30000) {
    this.data.set(key, JSON.parse(JSON.stringify(value))) // Ensure data is serializable
    this.timestamps.set(key, Date.now() + ttl)
  },
  get: function(key) {
    if (this.timestamps.get(key) > Date.now()) {
      return this.data.get(key)
    }
    this.data.delete(key)
    this.timestamps.delete(key)
    return null
  }
}

export async function getCryptoPrices() {
  try {
    const cachedData = cache.get('cryptoPrices')
    if (cachedData) {
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

    // Ensure data is serializable before caching
    const serializedData = JSON.parse(JSON.stringify(data))
    cache.set('cryptoPrices', serializedData)
    return serializedData
  } catch (error) {
    console.error('API Error:', error.message)
    throw new Error('Failed to fetch crypto prices. Please try again later.')
  }
}

export async function getCryptoDetail(id) {
  try {
    const cacheKey = `cryptoDetail-${id}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
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

    const serializedData = JSON.parse(JSON.stringify(data))
    cache.set(cacheKey, serializedData, 60000) // 1 minute cache
    return serializedData
  } catch (error) {
    console.error('API Error:', error.message)
    throw new Error('Failed to fetch crypto details. Please try again later.')
  }
}

export async function getCryptoHistory(id) {
  try {
    const cacheKey = `cryptoHistory-${id}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const { data } = await coingeckoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: 7,
        interval: 'daily'
      }
    })

    const serializedData = JSON.parse(JSON.stringify(data))
    cache.set(cacheKey, serializedData, 300000) // 5 minutes cache
    return serializedData
  } catch (error) {
    console.error('API Error:', error.message)
    throw new Error('Failed to fetch price history. Please try again later.')
  }
}

export async function getExchangeRates(base = 'USD') {
  try {
    const cacheKey = `exchangeRates-${base}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`)
    
    const serializedData = JSON.parse(JSON.stringify(data.rates))
    cache.set(cacheKey, serializedData, 3600000) // 1 hour cache
    return serializedData
  } catch (error) {
    console.error('API Error:', error.message)
    throw new Error('Failed to fetch exchange rates. Please try again later.')
  }
}
