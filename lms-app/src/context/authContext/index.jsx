import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/firebase"; 
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // NEW USER: Create fresh doc
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || "User",
          avatar: firebaseUser.photoURL || "https://via.placeholder.com/150",
          role: "student",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };
        await setDoc(userRef, newUserData);
        setProfile(newUserData);
        return newUserData;
      } else {
        // EXISTING USER: Update login time ONLY
        // This prevents overwriting "Princess Vanessa Adedeji" with Google's name
        await updateDoc(userRef, { lastLogin: serverTimestamp() });
        const existingData = userSnap.data();
        setProfile(existingData);
        return existingData;
      }
    } catch (error) {
      console.error("Profile Sync Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncProfile(result.user);
    } catch (error) {
      toast.error("Login failed.");
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isTeacher: profile?.role === "teacher", 
      loginWithGoogle, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);