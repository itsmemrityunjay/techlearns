import React from "react";

const UpgradeButton = () => {
  return (
    <div className="w-full md:w-[65%] flex items-center justify-right bg-[#dfdbf5] p-4 rounded-full shadow-lg gap-4">
      {/* Icon Container */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#003656]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18m9-9H3"
          />
        </svg>
      </div>

      {/* Text Content */}
      <div>
        <p className="text-gray-800 font-medium text-md">
        Connect, share, learn, and grow with tech enthusiasts worldwide!
        </p>
      </div>
    </div>
  );
};

export default UpgradeButton;
