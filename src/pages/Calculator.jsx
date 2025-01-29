import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getCryptoPrices, getExchangeRates } from '../api'

export default function Calculator() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [result, setResult] = useState(null)

  const { data: cryptoPrices, isLoading: isLoadingCrypto } = useQuery(
    'cryptoPrices',
    getCryptoPrices
  )

  const { data: fiatRates, isLoading: isLoadingFiat } = useQuery(
    'fiatRates',
    () => getExchangeRates()
  )

  useEffect(() => {
    if (!amount || !fromCurrency || !toCurrency || isLoadingCrypto || isLoadingFiat) {
      setResult(null)
      return
    }

    const calculate = () => {
      let fromRate = 1
      let toRate = 1

      // Get rates for the 'from' currency
      if (fromCurrency.startsWith('crypto_')) {
        const cryptoId = fromCurrency.replace('crypto_', '')
        const crypto = cryptoPrices.find(c => c.id === cryptoId)
        fromRate = crypto?.current_price || 0
      } else {
        fromRate = 1 / (fiatRates[fromCurrency] || 1)
      }

      // Get rates for the 'to' currency
      if (toCurrency.startsWith('crypto_')) {
        const cryptoId = toCurrency.replace('crypto_', '')
        const crypto = cryptoPrices.find(c => c.id === cryptoId)
        toRate = crypto?.current_price || 0
      } else {
        toRate = 1 / (fiatRates[toCurrency] || 1)
      }

      const calculatedResult = (amount * fromRate) / toRate
      setResult(calculatedResult)
    }

    calculate()
  }, [amount, fromCurrency, toCurrency, cryptoPrices, fiatRates, isLoadingCrypto, isLoadingFiat])

  if (isLoadingCrypto || isLoadingFiat) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const currencies = [
    ...Object.keys(fiatRates).map(code => ({ id: code, name: code })),
    ...cryptoPrices.map(crypto => ({ 
      id: `crypto_${crypto.id}`, 
      name: crypto.symbol.toUpperCase() 
    }))
  ]

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Currency Calculator</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select currency</option>
              {currencies.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select currency</option>
              {currencies.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-lg">
              {amount} {fromCurrency.replace('crypto_', '').toUpperCase()} =
            </p>
            <p className="text-3xl font-bold">
              {result.toFixed(8)} {toCurrency.replace('crypto_', '').toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
