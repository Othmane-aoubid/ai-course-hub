import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDWxM_umTnK-4aK-33kTOBFDxj8ZOTXjGM",
  authDomain: "ai-powered-online-course-app.firebaseapp.com",
  projectId: "ai-powered-online-course-app",
  storageBucket: "ai-powered-online-course-app.firebasestorage.app",
  messagingSenderId: "212400510035",
  appId: "1:212400510035:web:e7f87a19d0354084c322a6",
  measurementId: "G-7GK8F0W355"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };
