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
  apiKey: "AIzaSyC22g19WYuxpysNSWOSMBWWji6jzr-NLe4",
  authDomain: "lms-app-6745e.firebaseapp.com",
  projectId: "lms-app-6745e",
  storageBucket: "lms-app-6745e.firebasestorage.app",
  messagingSenderId: "443102390442",
  appId: "1:443102390442:web:635ce27bca18211af1c8d3",
  measurementId: "G-3Y9LGYSKP0"
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