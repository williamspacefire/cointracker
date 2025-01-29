import { Area, AreaChart, YAxis, ResponsiveContainer } from 'recharts'

export default function SparklineChart({ data, color = "#4f46e5" }) {
  const chartData = data.map((price, index) => ({ price }))
  const isPositive = chartData[0]?.price <= chartData[chartData.length - 1]?.price

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={['dataMin', 'dataMax']} hide />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          fill={`url(#gradient-${color.replace('#', '')})`}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
