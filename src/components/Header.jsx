import React, { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./Header.module.css";
import notification from "../images/notification.png";
import message from "../images/message.png";
import { useAuth } from "../context/authContext";

export default function Header() {
  const { profile, loading, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (loading) return <header className={styles.header}><div className={styles.text}><h1>Dashboard</h1><p>Loading...</p></div></header>;

  const fullName = profile?.name || "User";
  const userRole = profile?.role || "student";
  // Reliable avatar fallback using initials
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00173d&color=fff`;

  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h1>Dashboard</h1>
        <p>Welcome, {fullName}</p>
        <span className={styles.role}>Role: <strong>{userRole}</strong></span>
      </div>
      <div className={styles.icons}>
        <img src={notification} alt="Notifications" />
        <img src={message} alt="Messages" />
        <div className={styles.profileMenu}>
          <button className={styles.profileBtn} onClick={() => setShowProfile(!showProfile)}>
            <img 
              src={profile?.avatar && profile.avatar !== "photoURL" ? profile.avatar : fallback} 
              alt="Profile" 
              className={styles.miniAvatar} 
              onError={(e) => { e.target.src = fallback; }}
            />
          </button>
          {showProfile && (
            <div className={styles.dropdown} onMouseLeave={() => setShowProfile(false)}>
              <div className={styles.profileInfo}>
                <p><strong>{fullName}</strong></p>
                <button className={styles.logoutBtn} onClick={() => logout()}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}