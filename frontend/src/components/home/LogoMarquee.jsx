import React from "react";

const companyLogos = [
  "https://cdn.sanity.io/images/4792q8os/production/8e2810f8679049deed6ce16345b6b5d2f714b7ed-94x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/643964af343a970efdb1c2d48b0d603d7b1deccd-116x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/b06c6d95ebfcd31ece70b5b55ce3ba8894d8c2c7-114x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/e1c2655e10189eb55bfd9adafcf46f4c1a6c1141-34x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/f7bbd3e970cf9fe5be269984dac31e8a1960c5a9-114x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/d5db7b763861004d8056e4eebe024bc172b915e7-56x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/fb03942993ddc017170670bf5ac5bdb449bf1fa3-84x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/68820182bcfb968d182df1905a730759eb0d900d-110x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/0278d4d880f7cc0a364293f9455c22bebf412940-132x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/6501fb8f1b547d6478bb7471e682a9d531bca237-100x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/cce45a160e8b443503f8e018690865aeac15aa5c-134x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/0b775c9fb2fd3c5cea4e16cc3522af968630c062-130x60.svg",
  "https://cdn.sanity.io/images/4792q8os/production/aa72548f61a75dfbb560e52d9667e3f9455df9d1-88x60.svg",
];

const LogoMarquee = () => {
  return (
    <div className="relative w-full bg-[#f7f6f2] py-10 overflow-hidden flex items-center">
      {/* Scrolling logos container */}
      <div className="w-full overflow-hidden relative">
        <div className="marquee-container">
          <div className="marquee-content">
            {companyLogos.map((src, index) => (
              <div key={index} className="logo-container">
                <img
                  src={src}
                  alt="company logo"
                  className="h-12 md:h-16 opacity-60 hover:opacity-100 transition duration-300"
                />
              </div>
            ))}
          </div>
          <div className="marquee-content">
            {companyLogos.map((src, index) => (
              <div key={`duplicate-${index}`} className="logo-container">
                <img
                  src={src}
                  alt="company logo"
                  className="h-12 md:h-16 opacity-60 hover:opacity-100 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-[#f7f6f2] to-transparent"></div>
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#f7f6f2] to-transparent"></div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          width: fit-content;
          animation: scroll 20s linear infinite; /* Changed from 40s to 20s */
          will-change: transform;
        }
        
        .marquee-content {
          display: flex;
          align-items: center;
          flex-shrink: 0; /* Prevent content from shrinking */
        }
        
        .logo-container {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 40px; /* Consistent spacing between all logos */
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%); /* Only move by half the width */
          }
        }
        
        /* For smoother animation in modern browsers */
        @media (prefers-reduced-motion: no-preference) {
          .marquee-container {
            animation-play-state: running;
          }
        }
        
        /* Pause on hover effect (optional) */
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LogoMarquee;
