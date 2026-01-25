import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";

export default function TeacherRoute({ children }) {
  const { isTeacher, loading } = useAuth();

  useEffect(() => {
    // Only show the toast if loading is finished and they are confirmed NOT a teacher
    if (!loading && !isTeacher) {
      toast.error("Access Denied: Teacher permissions required.");
    }
  }, [isTeacher, loading]);

  // Wait for profile data to load so we know the user's role
  if (loading) return null;

  // If they aren't a teacher, bounce them to the student dashboard
  if (!isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if used as a wrapper, or Outlet if used as a layout route
  return children ? children : <Outlet />;
}