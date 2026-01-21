import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider, useAuth } from "./context/authContext";

// Components & Layout
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherRoute from "./components/TeacherRoute";

// Pages
import SignIn from "./pages/SignIn"; 
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/courses/CreateCourse";
import CourseList from "./pages/courses/CourseList";
import CourseDetails from "./pages/courses/CourseDetails";
import GenerateCertificate from "./pages/certificates/GenerateCertificate";

// Small component to handle the smart redirect at the root
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<SignIn />} />
          
          {/* Protected Routes (Authenticated Users) */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* Direct Dashboard Path */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Matches the link in your Sidebar.jsx */}
            <Route path="/all-courses" element={<CourseList />} />
            
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/generate-certificate/:courseId" element={<GenerateCertificate />} />
            
            {/* Teacher Only Routes */}
            <Route element={<TeacherRoute />}>
              <Route path="/manage-courses" element={<CourseList />} />
              <Route path="/create-course" element={<CreateCourse />} />
            </Route>
          </Route>

          {/* Smart Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}