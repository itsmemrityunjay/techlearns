import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../database/Firebase";
import Auth from "../database/Auth";
import Editor from "../components/comp/Editor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FaPen, FaCode, FaMoon, FaSun } from "react-icons/fa";
import Footer from "../components/comp/footer";
import vaishnavi from "../assets/vaishnavi.jpg"; // Import your image here

const Notebook = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [code, setCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle publishing notebook
  const handlePublish = async () => {
    if (!title) {
      toast.error("Please provide a title for your notebook");
      return;
    }

    try {
      setIsSubmitting(true);

      const notebook = {
        title,
        content: editorContent,
        tags: tags.split(",").map((tag) => tag.trim()).filter(tag => tag !== ""),
        privacy,
        code,
        author: user ? user.displayName || user.email : "Anonymous",
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: new Date(),
      };

      // 1. Create the notebook document
      const docRef = await addDoc(collection(db, "notebooks"), notebook);

      // 2. Update the user document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        notebooks: arrayUnion({
          id: docRef.id,
          title: title,
          createdAt: new Date(),
          privacy: privacy,
          tags: notebook.tags,
          previewContent: editorContent.substring(0, 100).replace(/<[^>]*>/g, '') // Strip HTML tags
        })
      });

      toast.success("Notebook published successfully!");

      // Optional: Clear the form
      setTitle("");
      setEditorContent("");
      setTags("");
      setCode("");
    } catch (error) {
      console.error("Error publishing notebook:", error);
      toast.error("Error publishing notebook!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />

      {user ? (
        <div className="container mx-auto px-0 py-8 sm:px-2 lg:px-0">
          <div className="w-full flex flex-col md:flex-row items-start justify-between py-4 md:py-10 md:bg-transparent min-h-[450px] rounded-xl">
            {/* Left Section */}
            <div className="flex-1 mt-8 md:mt-16 flex flex-col ">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Empower Your Learning!
              </h1>
              <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                Unlock the power of data with hands-on learning! Gain the skills and confidence to tackle independent data science projects — from data analysis to machine learning. <br className="hidden md:block" />
                Build your expertise and turn raw data into actionable insights for real-world applications.
              </p>

              {/* <div className="flex flex-wrap gap-4">
                      <button className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-6 rounded-3xl transition duration-200">
                        Join Competition
                      </button>
                      
                    </div> */}
            </div>

            {/* Right Section */}
            <div className="w-full md:w-[45%] mt-8 md:mt-0 flex justify-center items-center">
              <img
                src={vaishnavi}
                alt="Compete Visual"
                className="w-full h-auto object-contain rounded-lg max-h-[400px]"
              />
            </div>
          </div>
          {/* Header with dark mode toggle */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              Create Notebook
              <FaPen className="text-black px-1" />
            </h1>

            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
            </button> */}
          </div>

          {/* Card container for form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Title Input */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <label htmlFor="notebook-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notebook Title
              </label>
              <input
                id="notebook-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <label htmlFor="notebook-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <div
                className="border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 transition-colors"
                style={{ minHeight: "200px" }}
              >
                <ReactQuill
                  id="notebook-content"
                  value={editorContent}
                  onChange={setEditorContent}
                  placeholder="Write your notebook content here..."
                  className="h-64"
                  theme="snow"
                />
              </div>
            </div>

            {/* Tags & Privacy in a row for better space usage */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 dark:border-gray-700">
              {/* Tags Input */}
              <div>
                <label htmlFor="notebook-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  id="notebook-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., React, Firebase, Tailwind"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Privacy Options */}
              <div>
                <label htmlFor="notebook-privacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Privacy Setting
                </label>
                <select
                  id="notebook-privacy"
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="private">Private - Only visible to you</option>
                </select>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Editor
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                  Optional: Add code snippets to your notebook
                </span>
              </div>
              <Editor
                onRun={(code) => toast.info("Code executed")}
                onCodeChange={setCode}
                initialCode={code}
              />
            </div>

            {/* Action buttons */}
            <div className="p-6 bg-gray-50 dark:bg-gray-750 flex justify-end">
              <button
                onClick={handlePublish}
                disabled={isSubmitting || !title}
                className={`
                  px-5 py-2 rounded-md font-medium shadow-sm 
                  ${isSubmitting || !title ?
                    'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' :
                    'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                  }
                  flex items-center gap-2
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>) : (
                  <>Publish Notebook</>
                )}
              </button>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Your notebook will be saved to your profile and can be edited later.
          </div>
        </div>
      ) : (
        <Auth onAuth={() => setUser(auth.currentUser)} />
      )}
      <Footer />
    </div>
  );
};

export default Notebook;