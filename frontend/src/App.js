import React from "react";
import "./Colors.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Competition from "./pages/Competition";
import Layout from "./pages/Layout"; // Assuming Layout will handle the Sidebar
import Navbar from "./components/home/Navbar"; // Your Navbar Component
import Notebook from "./pages/Notebook";
import Admin from "./pages/dashboard/Admin";
import Discussions from "./pages/Discussions";
import User from "./pages/dashboard/User";

import ProtectedRoute from "./database/ProtectedRoutes";

import Course from "./pages/Course";
import CourseDetail from "./components/courses/CourseDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./database/AuthContext";
import Amin from "./pages/dashboard/Amin";
import CompDetail from "./components/comp/CompDetail";
import EditProfile from "./pages/dashboard/EditProfile";
import CourseDetailAdmin from "./components/courses/CourseDetailAdmin";
import NotFound from "./pages/NotFound";
import HostComp from "../src/components/comp/HostComp";
import DiscussForm from "./components/discuss/DiscussForm";
import Manageuser from "./pages/dashboard/Manageuser";
import UploadCourseVideo from "./pages/dashboard/UploadCourseVideo";
import AssignmentSubmit from "./pages/assignments/AssignmentSubmit";
// import ReviewSubmissions from "./pages/assignments/ReviewSubmissions";
import LiveStream from "./pages/assignments/LiveStream";
// import AdminNotifications from "./pages/dashboard/AdminNotifications";
import Mentors from "./components/comp/Mentors"; // Assuming you have a Mentors component

function App() {
  return (
    <>
      <AuthProvider>
        <div>
          <Routes>
            {/* Route for the Home Page with Navbar */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/amin"
              element={
                <Layout>
                  <ProtectedRoute roles={["sub-admin"]}>
                    <Admin />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Routes for other pages that will include Sidebar in Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/competition"
              element={
                <Layout>
                  <Competition />
                </Layout>
              }
            />
            <Route
              path="/notebook"
              element={
                <Layout>
                  <Notebook />
                </Layout>
              }
            />
            <Route
              path="/course"
              element={
                <Layout>
                  <Course />
                </Layout>
              }
            />

            <Route
              path="/discussion"
              element={
                <Layout>
                  <Discussions />
                </Layout>
              }
            />
            <Route
              path="/user"
              element={
                <Layout>
                  <ProtectedRoute
                    roles={["user", "admin", "sub-admin", "mentor", ""]}
                  >
                    <User />
                  </ProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/courses/:courseId"
              element={
                <Layout>
                  <CourseDetail />
                </Layout>
              }
            />
            <Route
              path="/courses-edit/:courseId"
              element={
                <Layout>
                  <CourseDetailAdmin />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute roles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <Layout>
                  <Amin />
                </Layout>
              }
            />
            <Route
              path="/courses/upload"
              element={
                <Layout>
                  <ProtectedRoute roles={["user", "admin", "sub-admin"]}>
                    <UploadCourseVideo />
                  </ProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/courses/:courseId/assignments/:assignmentId/submit"
              element={
                <Layout>
                  <ProtectedRoute roles={["user"]}>
                    <AssignmentSubmit />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Uncomment if needed
            <Route
              path="/courses/:courseId/assignments/:assignmentId/submissions"
              element={
                <Layout>
                  <ProtectedRoute roles={["admin", "sub-admin"]}>
                    <ReviewSubmissions />
                  </ProtectedRoute>
                </Layout>
              }
            />
            */}

            <Route
              path="/admin/notifications"
              element={
                <Layout>
                  <ProtectedRoute roles={["admin", "sub-admin"]}>
                    <Amin />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/live"
              element={
                <Layout>
                  <ProtectedRoute roles={["user"]}>
                    <LiveStream />
                  </ProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/host"
              element={
                <Layout>
                  <ProtectedRoute roles={["user"]}>
                    <HostComp />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/manageuser"
              element={
                <Layout>
                  <Manageuser />
                </Layout>
              }
            />
            <Route
              path="/discussForm"
              element={
                <Layout>
                  <DiscussForm />
                </Layout>
              }
            />
            <Route
              path="/competition/:id"
              element={
                <Layout>
                  <CompDetail />
                </Layout>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <Layout>
                  <EditProfile />
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/mentors" element={<Mentors />} />

            {/* Add more routes here */}
          </Routes>
        </div>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
