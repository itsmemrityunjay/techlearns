import React, { useState, useEffect } from "react";
import Sidebar from "../components/home/Sidebar";
import Sidebar1 from "../components/home/SideBar1"; // Import the Sidebar component

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to simulate loading; replace with actual load completion check if needed
    const loadTimeout = setTimeout(() => {
      setIsLoading(false); // Set loading to false when components are loaded
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(loadTimeout); // Clean up on unmount
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}
      <Sidebar1 />

      {/* Main content area */}
      <main className="flex-1 p-6 ml-5 overflow-y-auto transition-all duration-300">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            {/* Loader */}
            <div className="loader">
              <iframe
                src="https://lottie.host/embed/7ba88a5c-ed1e-4914-bc20-0c3bc677280c/YurJgPsrJ1.json"
                title="Loading Animation"
                style={{ width: "300px", height: "300px", border: "none" }}
                allowFullScreen
              ></iframe>

              {/* <iframe src=""></iframe> */}
            </div>
          </div>
        ) : (
          children // Render the specific page content when loaded
        )}
      </main>
    </div>
  );
};

export default Layout;
