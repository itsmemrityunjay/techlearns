import React from 'react';
import Courses from './Courses.jsx';
// import Guides from './Guides';
import vaishnavi from "../../assets/vaishnavi.jpg";

const LearnSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row items-start justify-between py-4 md:py-10 bg-[#cf9dd1] md:bg-transparent min-h-[450px] rounded-xl">
        {/* Left Section */}
        <div className="flex-1 mt-8 md:mt-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Empower Your Learning!
          </h1>
          <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
            Unlock the power of data with hands-on learning! Gain the skills and confidence to tackle independent data science projects — from data analysis to machine learning. <br className="hidden md:block" />
            Build your expertise and turn raw data into actionable insights for real-world applications.
          </p>

          {/* <div className="flex flex-wrap gap-4">
            <button className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-6 rounded-3xl transition duration-200">
              Join Competition
            </button>
            
          </div> */}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[45%] mt-8 md:mt-0 flex justify-center items-center">
          <img
            src={vaishnavi}
            alt="Compete Visual"
            className="w-full h-auto object-contain rounded-lg max-h-[400px]"
          />
        </div>
      </div>

      {/* Courses Section */}
      <Courses />

      {/* Optional Guides Section */}
      {/* <Guides /> */}
    </>
  );
};

export default LearnSection;
