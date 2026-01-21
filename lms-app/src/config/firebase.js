import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * FIREBASE CONFIGURATION
 * Using import.meta.env to pull values from your .env file.
 * This keeps your keys out of your source code and GitHub.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 1. Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * POPUP STABILITY FIX:
 * Ensures the auth service uses the proper domain handler on localhost.
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  auth.config.authDomain = firebaseConfig.authDomain;
}

// 3. Export for use throughout the app
export { app, auth, db, storage };