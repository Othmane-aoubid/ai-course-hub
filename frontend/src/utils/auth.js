import { getAuth } from 'firebase/auth';

export const getValidToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('No user is signed in');
  }

  try {
    // Force token refresh if it's close to expiring
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Setup token refresh interval (refreshes token every 30 minutes)
export const setupTokenRefresh = () => {
  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  
  setInterval(async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    } catch (error) {
      console.error('Error in token refresh interval:', error);
    }
  }, REFRESH_INTERVAL);
};
