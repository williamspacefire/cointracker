import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CurrencyDetail from './pages/CurrencyDetail'
import Calculator from './pages/Calculator'
import { CurrencyProvider } from './context/CurrencyContext'
import { PriceProvider } from './context/PriceContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import { LanguageProvider } from './context/LanguageContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from './utils/queryCache'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      cacheTime: Infinity,
      refetchInterval: 30000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      gcTime: Infinity
    }
  }
})

// Set up listeners for query cache updates
queryClient.getQueryCache().subscribe(({ query }) => {
  if (query.state.status === 'success') {
    persistQueryClient.saveQuery(query.queryKey, query.state.data)
  }
})

// Function to get initial data for queries
const getInitialData = (queryKey) => {
  return persistQueryClient.loadQuery(queryKey)
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <CurrencyProvider>
              <PriceProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/currency/:id" element={<CurrencyDetail />} />
                    <Route path="/calculator" element={<Calculator />} />
                  </Route>
                </Routes>
              </PriceProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

// Export the getInitialData function to be used in components
export { getInitialData }
