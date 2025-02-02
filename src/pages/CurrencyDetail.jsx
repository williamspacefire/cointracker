import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCryptoDetail, getCryptoHistory } from '../api'
import { useCurrency } from '../context/CurrencyContext'
import { usePrices } from '../context/PriceContext'
import { useTranslation } from '../i18n/translations'
import { formatLargeNumber } from '../utils/formatters'
import LastUpdated from '../components/LastUpdated'
import SparklineChart from '../components/SparklineChart'
import CurrencyCalculator from '../components/CurrencyCalculator'
import CurrencyDetailSkeleton from '../components/CurrencyDetailSkeleton'
import { getInitialData } from '../App'

export default function CurrencyDetail() {
  const { id } = useParams()
  const { baseCurrency } = useCurrency()
  const { prices: liveData, lastUpdated } = usePrices()
  const { t } = useTranslation()
  
  const detailQueryKey = ['cryptoDetail', id, baseCurrency]
  const historyQueryKey = ['cryptoHistory', id, baseCurrency]

  const { data: crypto } = useQuery({
    queryKey: detailQueryKey,
    queryFn: () => getCryptoDetail(id, baseCurrency),
    initialData: () => getInitialData(detailQueryKey)
  })

  const { data: history } = useQuery({
    queryKey: historyQueryKey,
    queryFn: () => getCryptoHistory(id, baseCurrency),
    initialData: () => getInitialData(historyQueryKey)
  })

  // Get live price data
  const liveCurrency = liveData?.find(c => c.id === id)

  // Show skeleton until we have both valid data sets
  if (!crypto || !history || !crypto.id || !history.prices) {
    return <CurrencyDetailSkeleton />
  }

  const priceChange = liveCurrency?.price_change_percentage_24h || crypto.market_data.price_change_percentage_24h
  const isPositive = priceChange >= 0
  const chartColor = isPositive ? '#16a34a' : '#dc2626'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {crypto.name} {t('common.price')}
        </h1>
        <LastUpdated timestamp={crypto.last_updated} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center mb-6">
          <img src={crypto.image.large} alt={crypto.name} className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{crypto.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">{t('common.price')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatLargeNumber(liveCurrency?.current_price || crypto.market_data.current_price.usd, baseCurrency.toUpperCase())}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">{t('common.change24h')}</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {priceChange.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">{t('common.marketCap')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatLargeNumber(liveCurrency?.market_cap || crypto.market_data.market_cap.usd, baseCurrency.toUpperCase())}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-500 dark:text-gray-400">{t('common.volume')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatLargeNumber(liveCurrency?.total_volume || crypto.market_data.total_volume.usd, baseCurrency.toUpperCase())}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {t('common.priceHistory')}
        </h2>
        <div className="h-[400px]">
          <SparklineChart 
            data={history.prices.map(([, price]) => price)}
            color={chartColor}
          />
        </div>
      </div>

      {liveCurrency && <CurrencyCalculator selectedCurrency={liveCurrency} />}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {t('common.additionalInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('common.circulatingSupply')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {crypto.market_data.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('common.maxSupply')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {crypto.market_data.max_supply ? 
                `${crypto.market_data.max_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}` : 
                t('common.unlimited')}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('common.allTimeHigh')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(crypto.market_data.ath.usd, baseCurrency.toUpperCase())}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('common.allTimeLow')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(crypto.market_data.atl.usd, baseCurrency.toUpperCase())}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
