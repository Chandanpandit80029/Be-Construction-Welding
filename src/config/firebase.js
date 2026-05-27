import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that Firebase is properly configured
const isFirebaseConfigured = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  for (const key of requiredKeys) {
    const value = firebaseConfig[key];
    if (!value || value === 'your-api-key' || value === 'your-project-id' || 
        value.includes('your-') || value === 'your-project-id.firebaseapp.com') {
      return false;
    }
  }
  return true;
};

// Initialize Firebase only if properly configured
let app = null;
let auth = null;
let db = null;
let storage = null;

const FIREBASE_CONFIGURED = isFirebaseConfigured();

if (FIREBASE_CONFIGURED && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error.message);
  }
} else if (getApps().length) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn(
    '⚠️ Firebase is not configured.\n' +
    'To configure Firebase:\n' +
    '1. Copy .env.example to .env\n' +
    '2. Add your Firebase project credentials\n' +
    '3. Restart the dev server\n\n' +
    'The app will work in demo mode with sample data.'
  );
}

export { 
  FIREBASE_CONFIGURED,
  isFirebaseConfigured
};
export { auth };
export { db };
export { storage };
export default app;