import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { getCryptoDetail, getCryptoHistory } from '../api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/format'

export default function CurrencyDetail() {
  const { id } = useParams()
  const { baseCurrency } = useCurrency()
  
  const { data: currency, isLoading: isLoadingCurrency } = useQuery(
    ['cryptoDetail', id],
    () => getCryptoDetail(id)
  )
  
  const { data: history, isLoading: isLoadingHistory } = useQuery(
    ['cryptoHistory', id],
    () => getCryptoHistory(id)
  )

  if (isLoadingCurrency || isLoadingHistory) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!currency || !history) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded">
        Error: Could not load currency data
      </div>
    )
  }

  const chartData = history.prices.map(([timestamp, price]) => ({
    date: format(new Date(timestamp), 'MMM d'),
    price
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-6">
          <img src={currency.image.large} alt={currency.name} className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-3xl font-bold">{currency.name}</h1>
            <p className="text-gray-500">{currency.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-500">Price</p>
            <p className="text-2xl font-bold">
              {formatCurrency(currency.market_data.current_price.usd, baseCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-500">24h Change</p>
            <p className={`text-2xl font-bold ${
              currency.market_data.price_change_percentage_24h >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {currency.market_data.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-500">Market Cap</p>
            <p className="text-2xl font-bold">
              {formatCurrency(currency.market_data.market_cap.usd, baseCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-500">24h Volume</p>
            <p className="text-2xl font-bold">
              {formatCurrency(currency.market_data.total_volume.usd, baseCurrency)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Price History (7 Days)</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#4f46e5" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
