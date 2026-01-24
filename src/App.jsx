import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider, useAuth } from "./context/authContext/index"; 

// Components & Layout
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherRoute from "./components/TeacherRoute";

// Pages
import SignIn from "./pages/SignIn"; 
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/courses/CreateCourse";
import CourseList from "./pages/courses/CourseList";
import CourseDetails from "./pages/courses/CourseDetails";
import GenerateCertificate from "./pages/certificates/GenerateCertificate";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading Oxford Portal...</p>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes inside MainLayout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-courses" element={<CourseList />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/generate-certificate/:courseId" element={<GenerateCertificate />} />
            
            {/* Exclusive Teacher Routes */}
            <Route element={<TeacherRoute />}>
              <Route path="/manage-courses" element={<CourseList />} />
              <Route path="/create-course" element={<CreateCourse />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}