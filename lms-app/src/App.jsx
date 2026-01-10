import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/courses/CreateCourse";
import CourseList from "./pages/courses/CourseList";
import GenerateCertificate from "./pages/certificates/GenerateCertificate";
import StudentProgress from "./pages/StudentProgress";

import { useAuth } from "./context/authContext";

function ProtectedRoute({ children }) {
  const { profile, loading } = useAuth();

  if (loading) return null; // wait until auth finishes
  if (!profile) return <Navigate to="/signin" replace />; // redirect if not logged in

  return children;
}

function PublicRoute({ children }) {
  const { profile, loading } = useAuth();

  if (loading) return null; // wait until auth finishes
  if (profile) return <Navigate to="/dashboard" replace />; // redirect if already logged in

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates/:courseId"
          element={
            <ProtectedRoute>
              <GenerateCertificate />
            </ProtectedRoute>
          }
        />

        {/* --- Default --- */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
