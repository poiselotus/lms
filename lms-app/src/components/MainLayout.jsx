import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../context/authContext";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const { profile, loading } = useAuth();

  // 1. Loading Guard: Prevents the "Hi, User" flicker
  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading Oxford Academy Profile...</p>
      </div>
    );
  }

  // 2. Safety Check: If for some reason sync failed, send back to login
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header />
        <div className={styles.content}>
          {/* Outlet ensures pages like CourseList swap correctly */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}