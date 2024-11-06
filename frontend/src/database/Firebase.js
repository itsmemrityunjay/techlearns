import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"; // For file uploads

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Firebase Storage

export { db, auth, storage };

// Function to register with email and password
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to get user data
export const getUserData = async (uid) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let userData = {};
  querySnapshot.forEach((doc) => {
    userData = { ...doc.data() };
  });
  return userData;
};

// Function to save a notebook in Firestore
export const saveNotebook = async (userId, notebook) => {
  try {
    // Adding a new notebook with the current timestamp as the ID
    await addDoc(collection(db, "notebooks"), {
      ...notebook,
      userId,
      createdAt: new Date(),
    });
    console.log("Notebook saved successfully!");
  } catch (error) {
    throw new Error("Error saving notebook: " + error.message);
  }
};

// Function to fetch notebooks for a user
export const getNotebooks = async (userId) => {
  const q = query(collection(db, "notebooks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const notebooks = [];
  querySnapshot.forEach((doc) => {
    notebooks.push({ id: doc.id, ...doc.data() });
  });
  return notebooks;
};

// Function to upload a file (like an input file) to Firebase Storage
export const uploadInputFile = async (userId, file) => {
  const storageReference = storageRef(
    storage,
    `inputFiles/${userId}/${file.name}`
  );
  try {
    const snapshot = await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL; // Return file download URL
  } catch (error) {
    throw new Error("Error uploading file: " + error.message);
  }
};
