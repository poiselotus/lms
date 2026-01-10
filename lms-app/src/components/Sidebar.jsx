import { useState } from "react";
import styles from "./Sidebar.module.css";
import oxfordtrans1 from "../images/oxfordtrans1.png";
import homeIcon from "../images/home.png";
import onlineLearningIcon from "../images/onlinelearning.png";
import paperIcon from "../images/paper.png";
import scheduleIcon from "../images/schedule.png";
import settingIcon from "../images/setting.png";
import chatIcon from "../images/chat.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const displayName = profile?.name
    ? profile.name.split(" ")[0]
    : "Student";

  const profilePic =
    profile?.photoURL || "https://via.placeholder.com/150";

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <aside className={`${styles.sidebar} ${!open ? styles.closed : ""}`}>
      <div className={styles.top}>
        <img src={oxfordtrans1} alt="Oxford Logo" className={styles.logo} />
        <button onClick={() => setOpen(!open)} className={styles.hamburger}>
          ☰
        </button>
      </div>

      {/* Profile */}
      <div className={styles.profile}>
        <img src={profilePic} alt="avatar" className={styles.avatar} />
        <div className={styles.info}>
          <p className={styles.name}>Hi, {displayName}</p>
          <small className={styles.id}>{profile?.studentId || "N/A"}</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <NavLink to="/dashboard">
          <img src={homeIcon} className={styles.icons} />
          Home
        </NavLink>

        <NavLink to="/courses">
          <img src={onlineLearningIcon} className={styles.icons} />
          My Courses
        </NavLink>

        <NavLink to="/assignments">
          <img src={paperIcon} className={styles.icons} />
          Assignments
        </NavLink>

        <NavLink to="/timetable">
          <img src={scheduleIcon} className={styles.icons} />
          Time Table
        </NavLink>

        <NavLink to="/forum">
          <img src={chatIcon} className={styles.icons} />
          Forum
        </NavLink>

        <NavLink to="/settings">
          <img src={settingIcon} className={styles.icons} />
          Settings
        </NavLink>
      </nav>

      {/* Logout  */}
      <div className={styles.logoutWrapper}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}
