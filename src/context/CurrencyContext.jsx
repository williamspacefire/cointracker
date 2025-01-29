import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [baseCurrency, setBaseCurrency] = useState(() => {
    return localStorage.getItem('baseCurrency') || 'USD'
  })

  useEffect(() => {
    localStorage.setItem('baseCurrency', baseCurrency)
  }, [baseCurrency])

  return (
    <CurrencyContext.Provider value={{ baseCurrency, setBaseCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
