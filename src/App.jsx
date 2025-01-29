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

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
