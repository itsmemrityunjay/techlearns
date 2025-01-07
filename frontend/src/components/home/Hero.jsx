import React from 'react';
import heroImage from "../../assets/Hero.svg";
import imageshero from "../../assets/imghome.jpg";
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCloud } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const Hero = () => {
    return (
         <div className="bg-white py-16 px-8 lg:px-24 flex flex-col lg:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="max-w-lg">
                  <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Master New Skills <br /> with{" "}
                    <span className="text-yellow-500">
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
                    Are you tired of pulling all-nighters and still struggling to keep
                    up with your coursework?
                  </p>
                  {/* Button */}
                  <div className="flex items-center gap-4 mb-8">
                    <button className="bg-black text-white py-2 px-8 rounded-full flex items-center font-semibold shadow-md hover:bg-gray-900">
                      <span className="mr-2">Get Started</span>
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
                      src="https://www.theuniques.in/static/media/theuniquesCommunity.de2335f2609ada2712b0.png"
                      alt="TIME logo"
                      className="h-8"
                    />
                    <img
                      src="https://www.sviet.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogo.8bdb37ea.webp&w=640&q=75"
                      alt="Forbes logo"
                      className="h-7"
                    />
                    <img
                      src="https://techlearns.in/Logo.png"
                      alt="TechCrunch logo"
                      className="h-8"
                    />
                  </div>
                </div>
                {/* Right Illustration */}
                <div className="mt-12 lg:mt-0 lg:ml-16">
                  <img
                    src="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
                    alt="Illustration"
                    className="w-full max-w-md lg:max-w-lg"
                  />
                </div>
              </div>
    );
};

export default Hero;
