import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/translations'

export default function SearchBar({ currencies }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const filteredCurrencies = currencies?.filter(currency => 
    currency.name.toLowerCase().includes(query.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(query.toLowerCase())
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (filteredCurrencies?.length > 0) {
      navigate(`/currency/${filteredCurrencies[0].id}`)
    }
  }

  return (
    <div className="relative flex-1 max-w-xl mx-4">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>
      
      {query && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredCurrencies?.map(currency => (
            <a
              key={currency.id}
              href={`/currency/${currency.id}`}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img src={currency.image} alt={currency.name} className="w-6 h-6 mr-3" />
              <span className="text-gray-900 dark:text-white">{currency.name}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({currency.symbol.toUpperCase()})
              </span>
            </a>
          ))}
          {filteredCurrencies?.length === 0 && (
            <div className="p-3 text-gray-500 dark:text-gray-400">
              {t('common.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
