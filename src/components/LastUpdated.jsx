import React from 'react'
import { format } from 'date-fns'

export default function LastUpdated({ timestamp }) {
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
      Last updated: {format(timestamp, 'HH:mm:ss')}
    </div>
  )
}
