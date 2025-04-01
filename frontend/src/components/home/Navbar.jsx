"use client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MenuIcon, X, Home, School, Trophy, FileText, MessageSquare, Sun, Moon, User } from "lucide-react";
import logo from "../../assets/Logo.png";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-lg bg-gray-100 dark:bg-gray-900" : "bg-white dark:bg-black"}`}>
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold dark:text-white">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.to} className="text-lg  text-gray-800 dark:text-gray-200">
               {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          </button>
          <button onClick={() => navigate("/user")} className="rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User" className="h-10 w-10 object-cover rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
