import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CurrencyDetail from './pages/CurrencyDetail'
import Calculator from './pages/Calculator'
import { CurrencyProvider } from './context/CurrencyContext'

function App() {
  return (
    <CurrencyProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/currency/:id" element={<CurrencyDetail />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </CurrencyProvider>
  )
}

export default App
