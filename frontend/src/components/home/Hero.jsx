import React from 'react';
import heroImage from "../../assets/Hero.svg";
import imageshero from "../../assets/imghome.jpg";
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCloud } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import yourImage from '../../assets/Right.png';
import go from "../../assets/go.png";

// In your component

const Hero = () => {
  const handelGetStarted = () => {
    navigate('/signin');
  }
  const navigate = useNavigate();

  return (
    <div
      className="py-16 px-8 lg:px-32 flex flex-col lg:flex-row items-center justify-between relative"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-vector/elegant-round-shape-modern-background-presentation_1017-50072.jpg?t=st=1743590465~exp=1743594065~hmac=a60ca070811383e312651b6fa32fb13b6ad9e30209e3133d3f585355de61c045&w=1380')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay (optional) */}
      <div className="absolute inset-0 bg-white bg-opacity-70 z-0"></div>

      {/* Content */}
      <div className="max-w-lg mt-32 relative z-10">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-[--secondary-color] leading-tight mb-6">
          Master New Skills <br /> with{" "}
          <span className="text-[#ffaa00]">
            <Typewriter
              words={["Techlearns"]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={50}
            />
          </span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          A premier learning platform designed to equip individuals with cutting-edge tech skills, enhance academic performance, and drive professional growth.
        </p>
        {/* Button */}
        <div className="flex items-center gap-4 mb-8">
          <button className="bg-[--secondary-color] text-white py-2 px-8 rounded-full flex items-center font-semibold shadow-md hover:bg-[--primary-color]" onClick={() => handelGetStarted()}>
            <span className="mr-2">Sign In</span>
            <span className="bg-white p-3 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-black" />
            </span>
          </button>
          <div className="flex items-center text-gray-700 ml-auto">
            <img
              src="https://img.freepik.com/premium-photo/color-user-icon-white-background_961147-8.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
              alt="User avatars"
              className="w-10 h-10 rounded-full border-2 border-white -ml-3"
            />
            <img
              src="https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
              alt="User avatars"
              className="w-10 h-10 rounded-full border-2 border-white -ml-3"
            />
            <span className="ml-4 text-sm font-medium">
              42k+ Using this app
            </span>
          </div>
        </div>

        {/* Logos Section */}
        <div className="flex justify-center lg:justify-start gap-8 mt-10 py-5">
          <img
            src="https://www.theuniques.in/assets/theuniquesCommunity-CaNp0pLp.png"
            alt="TIME logo"
            className="h-8"
          />
          <img
            src="https://www.sviet.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogo.8bdb37ea.webp&w=640&q=75"
            alt="Forbes logo"
            className="h-7"
          />
          <img
            src={go}
            alt="TechCrunch logo"
            className="h-8"
          />
        </div>
      </div>
      {/* Right Illustration */}
      <div className="mt-12 lg:mt-0 lg:ml-16 relative z-10">
        <img
          src={yourImage}
          alt="Illustration"
          className="w-full max-w-md lg:max-w-lg "
        />
      </div>
    </div>
  );
};

export default Hero;