import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getCryptoPrices } from '../api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/format'
import SparklineChart from '../components/SparklineChart'

export default function Home() {
  const { baseCurrency } = useCurrency()
  const { data: currencies, isLoading, error } = useQuery('cryptoPrices', getCryptoPrices, {
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-gray-600">Loading...</div>
    </div>
  )
  
  if (error) return (
    <div className="text-red-600 p-4 bg-red-50 rounded">
      Error: {error.message}
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {currencies?.map(currency => {
        const priceChange = currency.price_change_percentage_24h
        const isPositive = priceChange >= 0
        const chartColor = isPositive ? '#16a34a' : '#dc2626'

        return (
          <Link
            key={currency.id}
            to={`/currency/${currency.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={currency.image} alt={currency.name} className="w-8 h-8 mr-2" />
                <div>
                  <h2 className="text-xl font-semibold">{currency.name}</h2>
                  <p className="text-sm text-gray-500">{currency.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange.toFixed(2)}%
              </div>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-bold">{formatCurrency(currency.current_price, baseCurrency)}</p>
              <div className="mt-2 -mx-2">
                <SparklineChart 
                  data={currency.sparkline_in_7d.price} 
                  color={chartColor}
                />
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Volume: {formatCurrency(currency.total_volume, baseCurrency)}</span>
                <span>Mkt Cap: {formatCurrency(currency.market_cap, baseCurrency)}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
