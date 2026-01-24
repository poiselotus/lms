import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile, isTeacher, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className={styles.container}>Loading Oxford Portal...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.welcomeHeader}>
        <h1>Welcome, {profile?.name || "User"}</h1>
        <div className={styles.badgeContainer}>
          <span className={isTeacher ? styles.teacherBadge : styles.studentBadge}>
            {isTeacher ? "PROCTOR / TEACHER" : "STUDENT"}
          </span>
        </div>
      </header>

      {/* Primary Teacher Controls */}
      {isTeacher && (
        <section className={styles.statsOverview}>
          <div className={styles.statCard}>
            <h4>Total Courses</h4>
            <p>0</p>
          </div>
          <div className={styles.statCard}>
            <h4>Active Students</h4>
            <p>0</p>
          </div>
        </section>
      )}

      <div className={styles.mainGrid}>
        {/* Course Section */}
        <section className={styles.contentSection}>
          <h2>{isTeacher ? "Curriculum Management" : "My Learning Path"}</h2>
          <div className={styles.emptyState}>
            <p>{isTeacher ? "You haven't created any courses yet." : "You aren't enrolled in any courses."}</p>
            {isTeacher ? (
              <button 
                className={styles.actionBtn} 
                onClick={() => navigate("/create-course")}
              >
                Create Your First Course
              </button>
            ) : (
              <Link to="/all-courses" className={styles.browseLink}>Explore Catalog</Link>
            )}
          </div>
        </section>

        {/* Recent Activity or Notifications */}
        <aside className={styles.sidebarInfo}>
          <h3>Recent Activity</h3>
          <p className={styles.mutedText}>No new notifications.</p>
        </aside>
      </div>
    </div>
  );
}