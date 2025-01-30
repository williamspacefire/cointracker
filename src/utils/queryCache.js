const CACHE_PREFIX = 'query_cache_'
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

export const persistQueryClient = {
  // Save query data to localStorage
  saveQuery: (queryKey, data) => {
    try {
      const cacheKey = `${CACHE_PREFIX}${JSON.stringify(queryKey)}`
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error saving query to cache:', error)
    }
  },

  // Load query data from localStorage
  loadQuery: (queryKey) => {
    try {
      const cacheKey = `${CACHE_PREFIX}${JSON.stringify(queryKey)}`
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) return undefined

      const { data, timestamp } = JSON.parse(cached)
      const age = Date.now() - timestamp

      // Return undefined if cache is older than 5 minutes
      if (age > CACHE_TIME) {
        localStorage.removeItem(cacheKey)
        return undefined
      }

      return data
    } catch (error) {
      console.error('Error loading query from cache:', error)
      return undefined
    }
  }
} 