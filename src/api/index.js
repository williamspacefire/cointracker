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

export async function getCryptoPrices(currency = 'usd') {
  try {
    const currencyCode = typeof currency === 'object' && currency !== null 
      ? currency.code || 'usd'
      : String(currency || 'usd');
    
    const normalizedCurrency = currencyCode.toLowerCase();
    
    console.log('Fetching prices for currency:', normalizedCurrency) // Debug log
    
    const cacheKey = `cryptoPrices-${normalizedCurrency}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      console.log('Returning cached data:', cachedData) // Debug log
      return cachedData
    }

    const response = await coingeckoApi.get('/coins/markets', {
      params: {
        vs_currency: normalizedCurrency,
        order: 'market_cap_desc',
        per_page: 50,
        sparkline: true,
        price_change_percentage: '24h'
      }
    })

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid API response format')
    }

    console.log('API response:', response.data) // Debug log
    
    const serializedData = JSON.parse(JSON.stringify(response.data))
    cache.set(cacheKey, serializedData)
    return serializedData
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      currency: currency
    })
    return [] // Return empty array instead of throwing
  }
}

export async function getCryptoDetail(id, currency = 'usd') {
  try {
    // Extract currency code if an object is passed
    const currencyCode = typeof currency === 'object' && currency !== null 
      ? currency.code || 'usd'
      : String(currency || 'usd');
    
    const normalizedCurrency = currencyCode.toLowerCase();
    
    const cacheKey = `cryptoDetail-${id}-${normalizedCurrency}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    console.log('Fetching crypto details for:', id, 'currency:', normalizedCurrency) // Debug log

    const response = await coingeckoApi.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        market_data: true,
        vs_currency: normalizedCurrency
      }
    })

    if (!response.data) {
      throw new Error('No data received from API')
    }

    const serializedData = JSON.parse(JSON.stringify(response.data))
    cache.set(cacheKey, serializedData, 60000) // 1 minute cache
    return serializedData
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      id: id,
      currency: currency
    })

    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a minute.')
    }

    throw new Error(`Failed to fetch crypto details: ${error.message}`)
  }
}

export async function getCryptoHistory(id, currency = 'usd') {
  try {
    // Extract currency code if an object is passed
    const currencyCode = typeof currency === 'object' && currency !== null 
      ? currency.code || 'usd'
      : String(currency || 'usd');
    
    const normalizedCurrency = currencyCode.toLowerCase();
    
    const cacheKey = `cryptoHistory-${id}-${normalizedCurrency}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    console.log('Fetching crypto history for:', id, 'currency:', normalizedCurrency) // Debug log

    const response = await coingeckoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: normalizedCurrency,
        days: 7,
        interval: 'daily'
      }
    })

    if (!response.data) {
      throw new Error('No data received from API')
    }

    const serializedData = JSON.parse(JSON.stringify(response.data))
    cache.set(cacheKey, serializedData, 300000) // 5 minutes cache
    return serializedData
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      id: id,
      currency: currency
    })

    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a minute.')
    }

    throw new Error(`Failed to fetch price history: ${error.message}`)
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
