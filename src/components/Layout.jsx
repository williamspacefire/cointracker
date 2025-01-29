import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import { useTranslation } from '../i18n/translations'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'BRL']

export default function Layout() {
  const { baseCurrency, setBaseCurrency } = useCurrency()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900 dark:text-white font-bold">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                CurrencyTracker
              </Link>
              <Link to="/calculator" className="flex items-center ml-4 px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {t('header.calculator')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
