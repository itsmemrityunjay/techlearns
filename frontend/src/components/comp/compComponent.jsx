import React from "react";

const UpgradeButton = () => {
  return (
    <div className="w-[65%] flex items-center justify-right bg-[#dfdbf5] p-4 rounded-full shadow-lg gap-4">
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
        <p className="text-gray-800 font-medium text-sm">
        Level up your skills and ace competitions with confidence!
        </p>
        {/* <button className="text-[#5A3CFB] font-semibold text-sm flex items-center gap-1">
          Go Pro Now{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export default UpgradeButton;
