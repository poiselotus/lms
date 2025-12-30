import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import CreateCourse from "./pages/courses/CreateCourse";
import CourseList from "./pages/courses/CourseList";
import GenerateCertificate from "./pages/certificates/GenerateCertificate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/certificates/:courseId" element={<GenerateCertificate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
