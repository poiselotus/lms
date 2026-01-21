import React from "react";
// Change from ../../ to ../
import { useAuth } from "../context/authContext"; 
import styles from "./StudentProgress.module.css";

export default function StudentProgress() {
  const { profile } = useAuth();

  const modules = [
    { name: "Diploma in English", progress: 80 },
    { name: "Diploma in IT", progress: 70 },
    { name: "HND in Computing", progress: 50 },
  ];

  const assignments = [
    { title: "Assignment 1", status: "Completed" },
    { title: "Assignment 2", status: "Pending (Due 12 Jan)" },
    { title: "Assignment 3", status: "Pending (Due 20 Jan)" },
  ];

  const totalAvg = modules.length > 0 
    ? Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length) 
    : 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Learning Progress</h2>
      <p className={styles.welcome}>
        Hi {profile?.displayName || profile?.name || "Student"} 👋, here’s your academic overview.
      </p>

      {/* 1. Overall Progress */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Overall Course Completion</div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${totalAvg}%` }}></div>
        </div>
        <span className={styles.progressText}>{totalAvg}% Complete</span>
      </div>

      {/* 2. Modules Breakdown */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Module Breakdown</div>
        {modules.map((mod) => (
          <div key={mod.name} className={styles.module}>
            <p style={{ margin: 0, fontWeight: 500 }}>{mod.name}</p>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${mod.progress}%` }}></div>
            </div>
            <span className={styles.progressText}>{mod.progress}%</span>
          </div>
        ))}
      </div>

      {/* 3. Assignment Status */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Assignments & Tasks</div>
        {assignments.map((a, index) => (
          <div key={index} className={styles.assignment}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{a.title}</p>
            <span className={styles.status}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}