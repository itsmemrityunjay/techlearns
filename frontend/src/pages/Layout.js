import React from "react";
import Sidebar from "../components/home/Sidebar"; // Import the Sidebar component

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
        {children} {/* This will render the specific page content */}
      </main>
    </div>
  );
};

export default Layout;
