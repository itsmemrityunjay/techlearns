import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Show loading state while user data is being fetched
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Redirect based on role and route path
  const roleBasedPaths = {
    user: "/user",
    "sub-admin": "/admin",
    admin: "/dashboard",
  };

  // Redirect to assigned dashboard if trying to access an unauthorized path
  if (
    userData.role &&
    roles.includes(userData.role) &&
    roleBasedPaths[userData.role] !== location.pathname
  ) {
    return <Navigate to={roleBasedPaths[userData.role]} />;
  }

  // If role is specified in route but does not match user role, deny access
  if (roles && !roles.includes(userData.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
