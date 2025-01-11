import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

// Function to get a fresh token
const getFreshToken = async () => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('No user is signed in');
  }
  try {
    return await auth.currentUser.getIdToken(true);
  } catch (error) {
    console.error('Error getting fresh token:', error);
    throw error;
  }
};

// API call wrapper with automatic token refresh
export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get a fresh token before making the request
    const token = await getFreshToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // If we get a 401 unauthorized error, try to refresh the token and retry once
    if (response.status === 401) {
      try {
        // Force token refresh
        const newToken = await getFreshToken();
        
        // Retry the request with the new token
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw new Error(error.error || 'API call failed after token refresh');
        }

        return retryResponse.json();
      } catch (retryError) {
        console.error('Error in retry attempt:', retryError);
        throw retryError;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
