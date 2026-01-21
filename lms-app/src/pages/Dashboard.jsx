import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile, isTeacher } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.welcomeHeader}>
        <h1>Welcome back, {profile?.name?.split(" ")[0] || "User"}!</h1>
        <p>Logged in as: <strong>{profile?.role || "Student"}</strong></p>
      </header>

      {/* Teacher Action Section */}
      {isTeacher && (
        <section className={styles.teacherPanel}>
          <div className={styles.actionCard}>
            <h3>Course Management</h3>
            <p>Ready to upload a new curriculum?</p>
            <button 
              className={styles.createBtn} 
              onClick={() => navigate("/create-course")}
            >
              ➕ Create New Course
            </button>
          </div>
        </section>
      )}

      <section className={styles.coursesSection}>
        <h2>My Enrolled Courses</h2>
        <div className={styles.grid}>
          <p>No active enrollments found.</p>
          <Link to="/all-courses" className={styles.browseLink}>Browse Catalog</Link>
        </div>
      </section>
    </div>
  );
}