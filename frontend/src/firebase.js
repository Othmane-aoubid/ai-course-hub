import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { startTokenRefresh, stopTokenRefresh } from './utils/tokenRefresh';

const firebaseConfig = {
  apiKey: "AIzaSyDWxM_umTnK-4aK-33kTOBFDxj8ZOTXjGM",
  authDomain: "ai-powered-online-course-app.firebaseapp.com",
  projectId: "ai-powered-online-course-app",
  storageBucket: "ai-powered-online-course-app.firebasestorage.app",
  messagingSenderId: "212400510035",
  appId: "1:212400510035:web:e7f87a19d0354084c322a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Setup auth state observer and token refresh
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Start token refresh mechanism when user signs in
    await startTokenRefresh();
  } else {
    // Stop token refresh when user signs out
    stopTokenRefresh();
  }
});

export { db, auth, storage };
