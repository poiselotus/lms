import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC22g19WYuxpysNSWOSMBWWji6jzr-NLe4",
  authDomain: "lms-app-6745e.firebaseapp.com",
  projectId: "lms-app-6745e",
  storageBucket: "lms-app-6745e.firebasestorage.app",
  messagingSenderId: "443102390442",
  appId: "1:443102390442:web:635ce27bca18211af1c8d3",
  measurementId: "G-3Y9LGYSKP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
