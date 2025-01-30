import { useQuery } from '@tanstack/react-query'
import { getCryptoDetail, getCryptoHistory } from '../api'
import { useCurrency } from '../contexts/CurrencyContext'
// ... other imports

export default function CryptoDetail() {
  const { id } = useParams()
  const { baseCurrency } = useCurrency()

  const { data: crypto, isLoading: isLoadingCrypto } = useQuery({
    queryKey: ['cryptoDetail', id, baseCurrency],
    queryFn: () => getCryptoDetail(id, baseCurrency),
    staleTime: 30000,
    refetchInterval: 30000,
  })

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['cryptoHistory', id, baseCurrency],
    queryFn: () => getCryptoHistory(id, baseCurrency),
    staleTime: 30000,
    refetchInterval: 30000,
  })

  // ... rest of the component remains the same
}