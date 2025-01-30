import React, { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

const STORAGE_KEY = 'preferred_currency'

export function CurrencyProvider({ children }) {
  // Initialize state from localStorage, fallback to 'usd' if not found
  const [baseCurrency, setBaseCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY)
    return savedCurrency || 'usd'
  })

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, baseCurrency)
  }, [baseCurrency])

  return (
    <CurrencyContext.Provider value={{ baseCurrency, setBaseCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
