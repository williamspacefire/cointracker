import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCryptoPrices } from '../api'
import { useCurrency } from '../context/CurrencyContext'
import { useTranslation } from '../i18n/translations'
import { formatCurrency } from '../utils/format'
import SparklineChart from '../components/SparklineChart'
import Hero from '../components/Hero'
import LastUpdated from '../components/LastUpdated'
import CurrencySkeleton from '../components/CurrencySkeleton'
import { getInitialData } from '../App'

export default function Home() {
  const { baseCurrency } = useCurrency()
  const { t } = useTranslation()
  
  const queryKey = ['prices', baseCurrency]
  
  const { data: prices } = useQuery({
    queryKey,
    queryFn: () => getCryptoPrices(baseCurrency),
    initialData: () => getInitialData(queryKey)
  })

  // Show skeleton until we have valid data
  if (!prices || prices.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, index) => (
          <CurrencySkeleton key={index} />
        ))}
      </div>
    )
  }

  // Find the best performing currency
  const bestPerformer = [...prices].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  )[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t('header.cryptoPrices')}
        </h1>
        <LastUpdated timestamp={new Date().toISOString()} />
      </div>

      <Hero currency={bestPerformer} baseCurrency={baseCurrency} />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prices?.map(currency => {
          if (currency.id === bestPerformer.id) return null

          const priceChange = currency.price_change_percentage_24h
          const isPositive = priceChange >= 0
          const chartColor = isPositive ? '#16a34a' : '#dc2626'

          return (
            <Link
              key={currency.id}
              to={`/currency/${currency.id}`}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={currency.image} alt={currency.name} className="w-8 h-8 mr-2" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{currency.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currency.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {priceChange.toFixed(2)}%
                </div>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currency.current_price, baseCurrency)}
                </p>
                <div className="h-20 mt-2">
                  <SparklineChart 
                    data={currency.sparkline_in_7d.price} 
                    color={chartColor}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t('common.volume')}: {formatCurrency(currency.total_volume, baseCurrency)}</span>
                  <span>{t('common.marketCap')}: {formatCurrency(currency.market_cap, baseCurrency)}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
