import React from "react";
import { Link } from "react-router-dom"; // Removed useNavigate
import { useAuth } from "../context/authContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { profile, logout, user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      // We don't need navigate("/signin") here.
      // Once logout() clears the user state, ProtectedRoute in App.jsx
      // will see user is null and redirect for us automatically.
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Do not render anything if the auth state is still loading 
  // or if there is no authenticated user.
  if (loading || !user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/dashboard">Oxford Academy</Link>
      </div>
      <div className={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        
        {/* Role-based link */}
        {profile?.role === "teacher" && (
          <Link to="/create-course">Create Course</Link>
        )}
        
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {profile?.name || "User"}
            </span>
            <span className="text-xs text-gray-400 block leading-none">
              {profile?.role}
            </span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className={styles.logoutBtn}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}