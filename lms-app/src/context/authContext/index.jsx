import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (firebaseUser, manualRole = null) => {
    if (!firebaseUser) return null;

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        // IMMEDIATE STATE UPDATE: Set local profile before doing the background update
        setProfile(userData); 
        console.log("🔥 Profile state synced with role:", userData.role);

        // Background update for lastLogin
        await updateDoc(userRef, { 
          lastLogin: serverTimestamp() 
        });

        return userData;
      } else {
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}`,
          role: manualRole || "student", 
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };
        await setDoc(userRef, newUserData);
        setProfile(newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error("Critical Sync Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
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

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Source of Truth for Role
  const isTeacher = 
    profile?.role === "teacher" || 
    user?.uid === "EkVNU1vvdBRRUCGBazjnIIRVoJt1";

  const value = {
    user,
    profile,
    loading,
    userLoggedIn: !!user,
    isTeacher,
    syncProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);