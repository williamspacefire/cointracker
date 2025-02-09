import React from 'react'
import { Link } from 'react-router-dom'
import { formatLargeNumber } from '../utils/formatters'
import { formatCurrency } from '../utils/format'
import { useTranslation } from '../i18n/translations'
import SparklineChart from './SparklineChart'

export default function Hero({ currency, baseCurrency }) {
  const { t } = useTranslation()
  const priceChange = currency.price_change_percentage_24h_in_currency ?? currency.price_change_percentage_24h
  const isPositive = priceChange >= 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100">{t('common.bestPerformer')}</p>
            <h1 className="text-4xl font-bold mt-2 flex items-center">
              <img src={currency.image} alt={currency.name} className="w-10 h-10 mr-3" />
              {currency.name}
            </h1>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
              {priceChange.toFixed(2)}%
            </div>
            <p className="text-xl text-indigo-100 mt-1">
              {formatCurrency(currency.current_price, baseCurrency.toUpperCase())}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('common.marketCap')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(currency.market_cap, baseCurrency.toUpperCase())}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('common.volume')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(currency.total_volume, baseCurrency.toUpperCase())}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('common.circulatingSupply')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {currency.circulating_supply.toLocaleString()} {currency.symbol.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="h-24">
            <SparklineChart 
              data={currency.sparkline_in_7d.price}
              color={isPositive ? '#4ade80' : '#f87171'}
            />
          </div>
        </div>
        
        <Link
          to={`/currency/${currency.id}`}
          className="mt-6 block text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          {t('common.viewDetails')}
        </Link>
      </div>
    </div>
  )
}
