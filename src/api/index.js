import axios from 'axios'

const coingeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
})

export async function getCryptoPrices() {
  const { data } = await coingeckoApi.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      sparkline: true,
      price_change_percentage: '24h'
    }
  })
  return data
}

export async function getCryptoDetail(id) {
  const { data } = await coingeckoApi.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false
    }
  })
  return data
}

export async function getCryptoHistory(id) {
  const { data } = await coingeckoApi.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: 7,
      interval: 'daily'
    }
  })
  return data
}

export async function getExchangeRates(base = 'USD') {
  const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`)
  return data.rates
}
