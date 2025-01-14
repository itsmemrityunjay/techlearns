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
import Footer from "./components/home/Footer";
import ProtectedRoute from "./database/ProtectedRoutes";
import Auth from "./database/Auth";
import Course from "./pages/Course";
import CourseDetail from "./components/courses/CourseDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider } from "./database/AuthContext";
import Amin from "./pages/dashboard/Amin";
import CompDetail from "./components/comp/CompDetail";
import EditProfile from "./pages/dashboard/EditProfile";
import CourseDetailAdmin from "./components/courses/CourseDetailAdmin";
import NotFound from "./pages/NotFound";

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
                <>
                  {/* <Navbar /> */}
                  <Layout>
                    <ProtectedRoute roles={["sub-admin"]}>
                      <Admin />
                    </ProtectedRoute>
                  </Layout>
                </>
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

            {/* <Route path="/course/:id" element={<CourseDetail />} /> */}
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
                  <ProtectedRoute roles={["user"]}>
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
                  {/* <ProtectedRoute roles={["sub-admin"]}> */}
                  <CourseDetailAdmin />
                  {/* </ProtectedRoute> */}
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
                  {/* <ProtectedRoute roles={["user"]}> */}
                  <EditProfile />
                  {/* </ProtectedRoute> */}
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />

            {/* Add more routes here */}
          </Routes>
        </div>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
