"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MenuIcon,
  X,
  Home,
  School,
  Trophy,
  FileText,
  MessageSquare,
  Sun,
  Moon,
  User,
} from "lucide-react";
import logo from "../../assets/Logo.png";
import GirlSittingSVG from "../../assets/undraw_exams_d2tf.svg";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const menuItems = [
    { label: "SIGNIN", icon: <Home />, to: "/signin" },
    { label: "SIGNUP", icon: <User />, to: "/signup" },
    { label: "COMPETITION", icon: <Trophy />, to: "/competition" },
    { label: "COURSE", icon: <School />, to: "/course" },
    { label: "NOTEBOOK", icon: <FileText />, to: "/notebook" },
    { label: "DISCUSSION", icon: <MessageSquare />, to: "/discussion" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "shadow-lg bg-gray-100 dark:bg-gray-900"
          : "bg-transparent dark:bg-black"
          }`}
      >
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            {/* Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                ) : (
                  <MenuIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                )}
              </motion.div>
            </button>

            {/* Center Logo */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </Link>

            {/* Right Side Profile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => navigate("/user")}
                className="rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors"
              >
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User"
                  className="h-10 w-10 object-cover rounded-full"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-[9999] w-72 md:w-80 bg-white dark:bg-black shadow-xl overflow-y-auto flex flex-col"
          >
            {/* Yellow background texture - adapted for sidebar */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, #ffaa00 10%, transparent 20%), 
                                radial-gradient(circle at 80% 80%, #ffaa00 10%, transparent 20%)`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffaa00]/10 to-purple-500/5" />

            {/* Sidebar Header */}
            <div className="relative flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="relative p-6 flex-1">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="flex flex-col items-start justify-start space-y-6"
              >
                {menuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                        },
                      },
                    }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center space-x-3 text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-[#ffaa00] dark:hover:text-blue-400 transition-all duration-300"
                    >
                      {/* Animate only icon on group hover */}
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-[#003757] group-hover:text-[#ffaa00] transition-all duration-300"
                      >
                        {React.cloneElement(item.icon, { size: 28 })}
                      </motion.span>

                      <span className="relative group-hover:text-[#ffaa00] transition-all duration-300">
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ffaa00] group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Girl Illustration - positioned at the bottom */}
            <div className="relative h-48 mt-auto">
              <img
                src={GirlSittingSVG}
                alt="Girl Sitting"
                className="absolute bottom-0 right-0 w-40 md:w-72 opacity-70 pointer-events-none"
              />
            </div>

            {/* Decorative Elements - smaller for sidebar */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl animate-pulse" />
            <div className="absolute bottom-20 left-5 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
