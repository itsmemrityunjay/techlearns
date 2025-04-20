import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDocId, setUserDocId] = useState(null); // To store document ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(true);

      if (user) {
        try {
          // Always use the user's UID directly - no need for separate userDocId
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
            // Still setting userDocId but always to the UID
            setUserDocId(user.uid);
          } else {
            console.log("Creating new user document for:", user.uid);

            // Create a default user document if it doesn't exist
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: "user",
              createdAt: new Date(),
            };

            await setDoc(userDocRef, userData);
            setUserData(userData);
            setUserDocId(user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setUserDocId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      // Re-fetch user data using the same query logic
      try {
        const q = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        const fetchedDocId = querySnapshot.docs[0]?.id;

        if (!querySnapshot.empty) {
          const fetchedUserData = querySnapshot.docs[0]?.data();
          setUserData(fetchedUserData);
          setUserDocId(fetchedDocId);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    userDocId,
    refreshUserData, // Add this to make it available
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
