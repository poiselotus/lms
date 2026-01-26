import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { MdHome, MdOutlineLibraryBooks, MdLogout } from "react-icons/md";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Checks multiple possible fields for the image
  const profileImg = profile?.photoURL || profile?.avatar || profile?.imageUrl;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.imageContainer}>
          {profileImg ? (
            <img src={profileImg} alt="Profile" className={styles.profilePic} />
          ) : (
            <div className={styles.initials}>{profile?.name?.charAt(0) || "U"}</div>
          )}
        </div>
        <div className={styles.welcomeText}>
          <h3>Hi, {profile?.name?.split(" ")[0] || "User"}</h3>
          <p>Student ID: {profile?.studentId || "PD6BPI"}</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link to="/dashboard" className={`${styles.navItem} ${location.pathname === "/dashboard" ? styles.active : ""}`}>
          <MdHome className={styles.icon} />
          <span>Home</span>
        </Link>
        <Link to="/all-courses" className={`${styles.navItem} ${location.pathname === "/all-courses" ? styles.active : ""}`}>
          <MdOutlineLibraryBooks className={styles.icon} />
          <span>Browse Courses</span>
        </Link>
      </nav>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        <MdLogout /> Logout
      </button>
    </div>
  );
};

export default Sidebar;


