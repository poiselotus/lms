import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut 
} from "firebase/auth";
import { auth, db } from "./firebase"; // Added db import
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Added Firestore methods

// Updated to accept 'role' from your SignUp.jsx
export const doCreateUserWithEmailAndPassword = async (email, password, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // This creates the user profile in Firestore with the selected role
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: email.split('@')[0], // Default name from email prefix
    role: role || "student",    // Stores 'teacher' or 'student'
    createdAt: serverTimestamp(),
    avatar: "photoURL"          // Placeholder for the profile image
  });

  return userCredential;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // For Google Sign-in, we check/create a profile if it doesn't exist
  // Usually defaults to student unless you build a role-picker for Google users
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    role: "student", 
    avatar: user.photoURL,
    createdAt: serverTimestamp()
  }, { merge: true }); // 'merge: true' prevents overwriting existing roles

  return result;
};

export const doSignOut = () => {
  return signOut(auth);
};