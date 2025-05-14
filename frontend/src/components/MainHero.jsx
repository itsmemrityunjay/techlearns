
import React from 'react';
// import Courses from './Courses.jsx';
// import Guides from './Guides';
import vaishnavi from "../assets/vaishnavi.jpg";

const LearnSection = ({ title, description, image }) => {

  return (
    <>
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-8xl p-4 md:p-10  md:bg-transparent min-h-[450px] rounded-xl">
        {/* Left Section */}
        <div className="flex-1 mt-8 md:mt-16 px-4 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
            {description}{''}
          </p>


        </div>

        {/* Right Section */}
        <div className="w-full md:w-[25%] mt-8 md:mt-0 flex justify-center items-center">
          <img
            src={image}
            alt="Compete Visual"
            className="w-full h-auto object-contain rounded-lg max-h-[400px]"
          />
        </div>
      </div>

      {/* Courses Section */}


      {/* Optional Guides Section */}
      {/* <Guides /> */}
    </>
  );
};

export default LearnSection;

