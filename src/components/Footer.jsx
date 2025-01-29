import React from 'react'
import { useTranslation } from '../i18n/translations'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              CurrencyTracker
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {t('footer.aboutText')}
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('footer.disclaimerText')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.resources')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://www.coingecko.com/api" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.api')}
                </a>
              </li>
              <li>
                <a href="https://www.coingecko.com/api/documentation" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.documentation')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.support')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.legal')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('footer.disclaimer')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} CurrencyTracker. {t('footer.rights')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 md:mt-0">
              {t('footer.poweredBy')}{' '}
              <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                CoinGecko
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
