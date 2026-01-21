import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

/**
 * ProtectedRoute ensures only authenticated users can access specific pages.
 * It waits for the Firebase Auth + Firestore Sync to finish before deciding.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. While Firebase is checking the session and fetching the profile, show nothing or a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. If no user is logged in after loading finishes, redirect to Sign In
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  /**
   * 3. If user is authenticated:
   * - If used as a wrapper: <ProtectedRoute><Page /></ProtectedRoute> -> return children
   * - If used as a layout: <Route element={<ProtectedRoute />} /> -> return <Outlet />
   */
  return children ? children : <Outlet />;
};

export default ProtectedRoute;