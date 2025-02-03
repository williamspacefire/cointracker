import React, { useMemo, useState } from 'react'
import { usePrices } from '../context/PriceContext'
import { useTranslation } from '../i18n/translations'
import { formatCurrency } from '../utils/format'

export default function CurrencyCalculator({ selectedCurrency }) {
  const [amount, setAmount] = useState('1')
  const { prices: currencies } = usePrices()
  const { t } = useTranslation()

  // Calculate conversion results using useMemo so it re-computes only on dependency changes
  const result = useMemo(() => {
    if (!amount || !selectedCurrency || !currencies) return null
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return null

    return currencies.map(currency => ({
      symbol: currency.symbol.toUpperCase(),
      name: currency.name,
      value: (numAmount * selectedCurrency.current_price) / currency.current_price,
      price: currency.current_price
    }))
  }, [amount, selectedCurrency, currencies])

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('common.quickConvert')}
      </h2>
      
      <div className="flex items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('common.amount')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pl-4 pr-12 py-2"
              placeholder={t('common.amount')}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {selectedCurrency.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.slice(0, 6).map(item => (
              <div key={item.symbol} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.name}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.value.toFixed(8)} {item.symbol}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.price, 'USD')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
