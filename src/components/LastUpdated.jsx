import React from 'react'
import { format } from 'date-fns'
import { useTranslation } from '../i18n/translations'

export default function LastUpdated({ timestamp }) {
  const { t } = useTranslation()
  
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
      {t('common.lastUpdated')} {format(timestamp, 'HH:mm:ss')}
    </div>
  )
}
