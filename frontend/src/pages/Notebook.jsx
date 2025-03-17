import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../database/Firebase";
import Auth from "../database/Auth";
import Editor from "../components/comp/Editor";
import ReactQuill from "react-quill";
import Note from "../assets/Notebook.svg";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc } from "firebase/firestore";
import { FaEdit, FaFileAlt, FaTags, FaLock, FaUnlock, FaCode, FaPenFancy, FaRocket } from "react-icons/fa";
import nb from "../components/comp/nb.jpg";
import Footer from "../components/comp/footer";
const Notebook = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [code, setCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Default to light mode if no preference saved
      setDarkMode(false);
    }
  }, []);

  // Save theme to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Apply the theme to the entire document
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Monitor authentication state
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  // Handle publishing notebook
  const handlePublish = async () => {
    const notebook = {
      title,
      content: editorContent,
      tags: tags.split(",").map((tag) => tag.trim()),
      privacy,
      code,
      author: user ? user.displayName || user.email : "Anonymous",
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "notebooks"), notebook);
      console.log("Notebook published with ID:", docRef.id);
      toast.success("Notebook published successfully!");
    } catch (error) {
      console.error("Error publishing notebook:", error);
      toast.error("Error publishing notebook!");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen">
      <ToastContainer />
      {user ? (
        <div className="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between p-8"
            style={{
              backgroundImage: `url(${nb})`,
              backgroundSize: "contain", // Ensures the whole image is visible
              backgroundRepeat: "no-repeat", // Prevents tiling of the image
              backgroundPosition: "center",
              height: "450px",
              width: '100%',
            }}>
            <div className="flex-1 mb-6 md:mb-0 mt-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 ml-32">
                Logic & Latte
              </h1>
              <p className="text-gray-600 mb-6 ml-32 lg:w-[50%]">
                Where code meets caffeine, creativity sparks to life, and possibilities become limitless. It’s a space where ideas turn into innovation, and every line of code drives progress. Fueled by passion and imagination, this is where extraordinary creations come to life.
              </p>
            </div>


          </div>

          {/* Dark Mode Toggle */}


          {/* Form Section */}
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 transition-all transform duration-300">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
              <FaPenFancy className="mr-3 text-yellow-500 animate-spin" />
              Create Your Notebook
            </h2>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                <FaFileAlt className="inline mr-2 text-yellow-500" />
                Notebook Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-sm hover:border-yellow-400"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                <FaEdit className="inline mr-2 text-yellow-600" />
                Content
              </label>
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Write your notebook content here..."
                className="border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white text-gray-800 dark:border-gray-600 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-sm hover:border-yellow-400"
              />
            </div>

            {/* Tags Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                <FaTags className="inline mr-2 text-yellow-500" />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., React, Firebase, Tailwind"
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 hover:shadow-sm transition-all duration-300 hover:border-yellow-400"
              />
            </div>

            {/* Privacy Options */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                {privacy === "public" ? (
                  <FaUnlock className="inline mr-2 text-yellow-500 animate-bounce" />
                ) : (
                  <FaLock className="inline mr-2 text-red-500 animate-bounce" />
                )}
                Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full p-4 rounded-lg border hover:border-yellow-400 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* Publish Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handlePublish}
                className="bg-yellow-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaRocket className="text-white text-2xl animate-pulse" />
                <span className="text-lg">Publish Notebook</span>
              </button>
            </div>

          </div>

          {/* Code Editor Section */}


          {/* Code Editor Section */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
              Code Editor <FaCode className="inline ml-2 text-gray-500 dark:text-gray-300" />
            </h2>
            <Editor onRun={(code) => toast.success("Code executed!")} onCodeChange={setCode} />
          </div>
        </div>
      ) : (
        // <Auth onAuth={() => setUser(auth.currentUser)} />
        console.log("Hello")
      )}
      <Footer />
    </div>
  );
};

export default Notebook;