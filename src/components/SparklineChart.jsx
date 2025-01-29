import React from 'react'
import { Area, AreaChart, YAxis, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

export default function SparklineChart({ data, color = "#4f46e5" }) {
  const { isDark } = useTheme()
  const chartData = data.map((price, index) => ({ price }))
  const isPositive = chartData[0]?.price <= chartData[chartData.length - 1]?.price

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis 
          domain={['dataMin', 'dataMax']} 
          hide 
          stroke={isDark ? '#ffffff' : '#000000'}
        />
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
