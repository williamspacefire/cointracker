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
import { useLanguage } from '../context/LanguageContext'
import { formatLargeNumber } from '../utils/formatters'

// Moved outside to avoid re-declaration on every render
const ArrowUpIcon = () => (
  <svg className="inline-block w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5L19 12L12 19M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 12 12)"/>
  </svg>
)

const ArrowDownIcon = () => (
  <svg className="inline-block w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5L19 12L12 19M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)"/>
  </svg>
)

export default function Home() {
  const { baseCurrency } = useCurrency()
  const { t } = useTranslation()
  const { translations } = useLanguage()
  
  const queryKey = ['prices', baseCurrency]
  
  const { data: prices } = useQuery({
    queryKey,
    queryFn: () => getCryptoPrices(baseCurrency),
    initialData: () => getInitialData(queryKey)
  })

  // Calculate total market cap and 24h change
  const totalMarketCap = prices?.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0) || 0
  const marketCapChange24h = prices?.[0]?.market_cap_change_percentage_24h || 0

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('common.todaysPrices')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('common.globalMarketCap')}{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {formatLargeNumber(totalMarketCap, baseCurrency.toUpperCase())}
          </span>
          {' '}
          <span className={`font-medium inline-flex items-center ${
            marketCapChange24h >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {marketCapChange24h >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(marketCapChange24h).toFixed(2)}%
          </span>
          {' '}
          {marketCapChange24h >= 0 ? t('common.increase') : t('common.decrease')}{' '}
          {t('common.overLastDay')}.
        </p>
        <LastUpdated timestamp={new Date().toISOString()} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">{t('common.coin')}</th>
              <th className="py-3 px-4">{t('common.price')}</th>
              <th className="py-3 px-4">1h</th>
              <th className="py-3 px-4">24h</th>
              <th className="py-3 px-4">7d</th>
              <th className="py-3 px-4">{t('common.volume')}</th>
              <th className="py-3 px-4">{t('common.marketCap')}</th>
              <th className="py-3 px-4">{t('common.last7Days')}</th>
            </tr>
          </thead>
          <tbody>
            {prices?.map((currency, index) => {
              const {
                price_change_percentage_24h_in_currency: priceChange = 0,
                price_change_percentage_1h_in_currency: hourChange = 0,
                price_change_percentage_7d_in_currency: weekChange = 0,
              } = currency
              const isPositive = priceChange >= 0
              const chartColor = isPositive ? '#16a34a' : '#dc2626'

              return (
                <tr 
                  key={currency.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-4 px-4 text-black dark:text-white">{index + 1}</td>
                  <td className="py-4 px-4">
                    <Link to={`/currency/${currency.id}`} className="flex items-center">
                      <img src={currency.image} alt={currency.name} className="w-6 h-6 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">{currency.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">{currency.symbol.toUpperCase()}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(currency.current_price, baseCurrency.toUpperCase())}
                  </td>
                  <td className={`py-4 px-4 ${hourChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {hourChange.toFixed(1)}%
                  </td>
                  <td className={`py-4 px-4 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {priceChange.toFixed(1)}%
                  </td>
                  <td className={`py-4 px-4 ${weekChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {weekChange.toFixed(1)}%
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    {formatLargeNumber(currency.total_volume, baseCurrency.toUpperCase())}
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    {formatLargeNumber(currency.market_cap, baseCurrency.toUpperCase())}
                  </td>
                  <td className="py-4 px-4 w-[200px]">
                    <div className="h-[50px]">
                      <SparklineChart 
                        data={currency.sparkline_in_7d.price}
                        color={chartColor}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
