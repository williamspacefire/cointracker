import React, { useState } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import LastUpdated from './LastUpdated'

export default function Calculator({ price }) {
  const [amount, setAmount] = useState('')
  const { baseCurrency } = useCurrency()

  // Allow only numbers and dot in the input
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  const calculatedAmount = amount && price ? (amount / price).toFixed(8) : ''

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Calculator</h3>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount in {baseCurrency.toUpperCase()}
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleChange}
            placeholder={`Enter amount in ${baseCurrency.toUpperCase()}`}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        {amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Converted Amount in {price && typeof price === 'object' ? price.symbol?.toUpperCase() : 'Crypto'}
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {calculatedAmount}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
