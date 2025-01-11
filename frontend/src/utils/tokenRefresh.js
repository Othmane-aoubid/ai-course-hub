import { getAuth } from 'firebase/auth'

// Token refresh interval (5 minutes before expiration)
const REFRESH_INTERVAL = 55 * 60 * 1000 // 55 minutes

let refreshInterval = null

export const startTokenRefresh = async () => {
  const auth = getAuth()
  
  // Initial token refresh
  if (auth.currentUser) {
    try {
      await auth.currentUser.getIdToken(true)
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  // Clear any existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }

  // Set up periodic token refresh
  refreshInterval = setInterval(async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken(true)
        console.log('Token refreshed successfully')
      } catch (error) {
        console.error('Error in token refresh interval:', error)
      }
    }
  }, REFRESH_INTERVAL)
}

export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}
