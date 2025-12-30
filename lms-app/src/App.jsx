import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";

import CreateCourse from "./pages/courses/CreateCourse";
import CourseList from "./pages/courses/CourseList";
import GenerateCertificate from "./pages/certificates/GenerateCertificate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Courses */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/create" element={<CreateCourse />} />

        {/* Certificates */}
        <Route
          path="/certificates/:courseId"
          element={<GenerateCertificate />}
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
