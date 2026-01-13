import React from "react";
import styles from "./StudentProgress.module.css";

export default function StudentProgress() {
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

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Student Progress</h2>
      <p className={styles.welcome}>Hi Alex 👋, here’s your current progress overview.</p>

      {/* Overall Progress */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Overall Course Completion</div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "65%" }}></div>
        </div>
        <span className={styles.progressText}>65% Complete</span>
      </div>

      {/* Modules */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Modules</div>
        {modules.map((mod) => (
          <div key={mod.name} className={styles.module}>
            <p className={styles.moduleName}>{mod.name}</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${mod.progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{mod.progress}%</span>
          </div>
        ))}
      </div>

      {/* Assignments */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Assignments</div>
        {assignments.map((a) => (
          <div key={a.title} className={styles.assignment}>
            <p className={styles.assignmentTitle}>{a.title}</p>
            <span className={styles.status}>{a.status}</span>
          </div>
        ))}
      </div>

      {/* Attendance */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Attendance</div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "95%" }}></div>
        </div>
        <span className={styles.progressText}>95% Attendance</span>
      </div>

      {/* Next Steps */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Next Steps</div>
        <p>Complete HND in Computing module and submit pending assignments.</p>
      </div>
    </div>
  );
}
