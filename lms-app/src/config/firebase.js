import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (USE ENV VARIABLES ONLY)
const firebaseConfig = {
  apiKey: "AIzaSyC22g19WYuxpysNSWOSMBWWji6jzr-NLe4",
  authDomain: "lms-app-6745e.firebaseapp.com",
  projectId: "lms-app-6745e",
  storageBucket: "lms-app-6745e.firebasestorage.app",
  messagingSenderId: "443102390442",
  appId: "1:443102390442:web:635ce27bca18211af1c8d3",
  measurementId: "G-3Y9LGYSKP0"
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Firebase config missing. Check your .env file");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
