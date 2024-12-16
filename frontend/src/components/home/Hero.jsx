import React from 'react';
import heroImage from "../../assets/Hero.svg";
import imageshero from "../../assets/imghome.jpg";
const Hero = () => {
    return (
        <div className="min-h-full bg-white dark:bg-gray-900 flex flex-col lg:flex-row items-center justify-between container mx-auto pb-8 transition-colors duration-300"
        style={{
            backgroundImage: `url(${imageshero})`, // Referencing the public folder directly
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
        }}
        >

            {/* Left Side: Text */}
            <div className="lg:w-1/2 flex flex-col mx-2 pr:0 lg:pr-12 space-y-6 text-left lg:text-left">
                <h1 className="text-3xl lg:text-6xl leading-10 font-bold text-blue-900 dark:text-gray-200 transition-colors duration-300">
                <span className="font-extrabold text-customBlue dark:text-gray-100 drop-shadow-lg scale-110 inline-block max-w-xl ml-16">
        EMBRACE THE GENIUS WITHIN YOU
    </span> 
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300 ml-8">
                   <span className='text-customOrange text-bold'>Unlock your potential</span> with cutting-edge courses designed to empower learners of all ages. Whether you're just starting your journey or advancing your career, Tech Learns Academy offers hands-on training in web development, digital marketing, and more. Join a community of innovators and become future-ready with personalized guidance from industry experts.
                </p>
            </div>

            {/* Right Side: Browser Mockup */}
            <div className="relative lg:w-1/2 flex justify-center items-center mx-auto mt-4 lg:mt-0">
                <img src={heroImage} alt="Hero Image" className="transition-transform duration-300" />
            </div>
        </div>
    );
};

export default Hero;
