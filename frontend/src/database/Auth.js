import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../database/Firebase"; // Make sure this imports Firebase auth
import { onAuthStateChanged } from "firebase/auth";

// Create a Context for Authentication
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup the subscription on unmount
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for consuming Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider; // Correct default export
