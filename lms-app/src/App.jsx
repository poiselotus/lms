import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context - Adjusted path to match your new folder structure
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

/**
 * RootRedirect handles the initial landing logic.
 * If the user is logged in, they go to Dashboard.
 * If not, they are sent to the Sign In page.
 */
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
        {/* Global Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* --- Protected Student/Common Routes --- */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-courses" element={<CourseList />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/generate-certificate/:courseId" element={<GenerateCertificate />} />
            
            {/* --- Exclusive Teacher Routes --- */}
            <Route element={<TeacherRoute />}>
              <Route path="/manage-courses" element={<CourseList />} />
              <Route path="/create-course" element={<CreateCourse />} />
            </Route>
          </Route>

          {/* --- Redirects --- */}
          <Route path="/" element={<RootRedirect />} />
          {/* Catch-all for 404s redirects back to root logic */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
