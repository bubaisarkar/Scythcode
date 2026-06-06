// Firebase Client SDK Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4LKWgTT1GbKO0L659-FkiupAnSoMj8JA",
  authDomain: "scythcode.firebaseapp.com",
  projectId: "scythcode",
  storageBucket: "scythcode.firebasestorage.app",
  messagingSenderId: "638789165294",
  appId: "1:638789165294:web:c972f6433c9880bdc913ff"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
