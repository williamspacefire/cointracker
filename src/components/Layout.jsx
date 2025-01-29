import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import { usePrices } from '../context/PriceContext'
import { useTranslation } from '../i18n/translations'
import { useLanguage } from '../context/LanguageContext'
import { LANGUAGES } from '../i18n/translations'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'
import SearchBar from './SearchBar'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'BRL']

export default function Layout() {
  const { baseCurrency, setBaseCurrency } = useCurrency()
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { prices: currencies } = usePrices()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-1">
              <Link to="/" className="flex items-center pr-4">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white">CurrencyTracker</span>
              </Link>
              <SearchBar currencies={currencies} />
            </div>
            
            <div className="flex items-center space-x-4 ml-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-28 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="block w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
