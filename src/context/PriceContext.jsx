import React, { createContext, useContext } from 'react'
import { useQuery } from 'react-query'
import { getCryptoPrices } from '../api'

const PriceContext = createContext()

export function PriceProvider({ children }) {
  const { data, isLoading, error, dataUpdatedAt } = useQuery(
    'cryptoPrices',
    getCryptoPrices,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 30000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Price fetch error:', error.message)
      }
    }
  )

  const value = {
    prices: data || [],
    isLoading,
    error,
    lastUpdated: dataUpdatedAt
  }

  return (
    <PriceContext.Provider value={value}>
      {children}
    </PriceContext.Provider>
  )
}

export function usePrices() {
  const context = useContext(PriceContext)
  if (!context) {
    throw new Error('usePrices must be used within a PriceProvider')
  }
  return context
}
