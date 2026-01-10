import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import React, { useContext, useEffect, useState } from "react";
import { getDocument, setDocument } from "../../config/firestore";
import { doSignOut } from "../../config/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    setLoading(true);

    if (user) {
      // Firebase Auth basic user
      const authUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "", 
      };

      setCurrentUser(authUser);
      setUserLoggedIn(true);

      try {
        // Load profile from Firestore
        const doc = await getDocument("users", user.uid);

        if (doc) {
          setProfile(doc);
        } else {
          // Create profile if it does not exist
          const newProfile = {
            uid: user.uid,
            fullName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            role: "student",
            enrolledCourses: [],
            createdAt: new Date().toISOString(),
          };

          await setDocument("users", user.uid, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.warn("Failed to load/create user profile", err);
        setProfile(null);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setProfile(null);
    }

    setLoading(false);
  }

  //LOGOUT
  async function signOut() {
    await doSignOut();
  }

  const value = {
    currentUser,   // auth data
    profile,       
    userLoggedIn,
    loading,
    signOut,       
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
