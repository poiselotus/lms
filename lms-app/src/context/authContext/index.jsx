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
      // basic auth user
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
      });
      setUserLoggedIn(true);

      try {
        // try to load profile from Firestore `users/{uid}`
        const doc = await getDocument("users", user.uid);
        if (doc) {
          setProfile(doc);
        } else {
          // create a minimal profile if none exists
          const newProfile = {
            uid: user.uid,
            name: user.displayName || "",
            role: "student",
            enrolledCourses: [],
            email: user.email || "",
            createdAt: new Date().toISOString(),
          };
          await setDocument("users", user.uid, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.warn("failed to load/create user profile", err);
        setProfile(null);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setProfile(null);
    }

    setLoading(false);
  }

  async function signOut() {
    await doSignOut();
  }

  const value = {
    currentUser,
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
