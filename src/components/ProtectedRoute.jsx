import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Adjusted path to your context

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // If Firebase is still checking the auth state, show nothing or a spinner
  // This prevents the "flash" of the login page for logged-in users
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Authenticating...</p>
      </div>
    );
  }

  // If not loading and no user is found, send them to Sign In
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}