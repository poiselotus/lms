import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Fixed: Added missing import

// Styles and Assets
import styles from "./Sidebar.module.css";
import oxfordLogo from "../images/oxfordtrans1.png";
import homeIcon from "../images/home.png";
import browseIcon from "../images/onlinelearning.png";

export default function Sidebar() {
    const { profile, loading, isTeacher } = useAuth();

    // Guard: Prevent crash while loading
    if (loading) return <div className={styles.sidebar}></div>;

    const fullName = profile?.name || "User";
    const firstName = fullName.split(" ")[0];
    
    // Fallback avatar using initials
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00173d&color=fff`;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.top}>
                <img src={oxfordLogo} alt="Oxford Academy" className={styles.logo} />
            </div>

            <div className={styles.profileBox}>
                <img 
                    src={profile?.avatar && profile.avatar !== "photoURL" ? profile.avatar : fallback} 
                    alt="User" 
                    className={styles.avatar} 
                    onError={(e) => { e.target.src = fallback; }}
                />
                <div className={styles.info}>
                    <p className={styles.welcomeText}>Hi, {firstName}</p>
                    <small>
                        {isTeacher ? "Teacher" : "Student"} ID: {profile?.uid?.slice(0,6).toUpperCase() || "---"}
                    </small>
                </div>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    <img src={homeIcon} alt="" /> Home
                </NavLink>
                
                <NavLink to="/all-courses" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    <img src={browseIcon} alt="" /> Browse Courses
                </NavLink>

                {/* Teacher Only Section: Only Marcel sees this */}
                {isTeacher && (
                    <div className={styles.teacherSection}>
                        <div className={styles.divider}>Teacher Panel</div>
                        <NavLink to="/create-course" className={({ isActive }) => isActive ? styles.active : styles.link}>
                            <span style={{ marginRight: '10px' }}>➕</span> Create Course
                        </NavLink>
                        <NavLink to="/manage-courses" className={({ isActive }) => isActive ? styles.active : styles.link}>
                            <span style={{ marginRight: '10px' }}>🛠️</span> Manage Courses
                        </NavLink>
                    </div>
                )}
            </nav>
        </aside>
    );
}
