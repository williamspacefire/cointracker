import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getCryptoDetail, getCryptoHistory } from '../api'
import { useCurrency } from '../context/CurrencyContext'
import { usePrices } from '../context/PriceContext'
import { formatCurrency } from '../utils/format'
import LastUpdated from '../components/LastUpdated'
import SparklineChart from '../components/SparklineChart'

export default function CurrencyDetail() {
  const { id } = useParams()
  const { baseCurrency } = useCurrency()
  const { prices: liveData, lastUpdated } = usePrices()
  
  const { data: currency, isLoading: isLoadingCurrency } = useQuery(
    ['cryptoDetail', id],
    () => getCryptoDetail(id)
  )
  
  const { data: history, isLoading: isLoadingHistory } = useQuery(
    ['cryptoHistory', id],
    () => getCryptoHistory(id)
  )

  // Get live price data
  const liveCurrency = liveData?.find(c => c.id === id)

  if (isLoadingCurrency || isLoadingHistory) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!currency || !history) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded">
        Error: Could not load currency data
      </div>
    )
  }

  const priceChange = liveCurrency?.price_change_percentage_24h || currency.market_data.price_change_percentage_24h
  const isPositive = priceChange >= 0
  const chartColor = isPositive ? '#16a34a' : '#dc2626'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{currency.name} Price</h1>
        <LastUpdated timestamp={lastUpdated} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center mb-6">
          <img src={currency.image.large} alt={currency.name} className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currency.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{currency.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(liveCurrency?.current_price || currency.market_data.current_price.usd, baseCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">24h Change</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {priceChange.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">Market Cap</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(liveCurrency?.market_cap || currency.market_data.market_cap.usd, baseCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">24h Volume</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(liveCurrency?.total_volume || currency.market_data.total_volume.usd, baseCurrency)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Price History (7 Days)</h2>
        <div className="h-[400px]">
          <SparklineChart 
            data={history.prices.map(([, price]) => price)}
            color={chartColor}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Circulating Supply</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currency.market_data.circulating_supply.toLocaleString()} {currency.symbol.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Max Supply</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currency.market_data.max_supply ? 
                `${currency.market_data.max_supply.toLocaleString()} ${currency.symbol.toUpperCase()}` : 
                'Unlimited'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">All-Time High</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(currency.market_data.ath.usd, baseCurrency)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">All-Time Low</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(currency.market_data.atl.usd, baseCurrency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
