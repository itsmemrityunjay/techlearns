import React from 'react';
import Courses from './Courses.jsx';
// import Guides from './Guides';
import herocompetition from '../comp/herocompetition.jpg';

const LearnSection = () => {
    return (
        <>
            {/* Hero Section */}
            <div
                className="w-full flex items-center justify-center relative bg-center bg-no-repeat bg-cover"
                style={{
                    backgroundImage: `url(${herocompetition})`,
                    minHeight: '450px', // fallback for smaller devices
                }}
            >
                {/* Optional Overlay for text visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center text-center px-6 py-12 md:px-20 w-full h-full">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Empower Your Learning!
                    </h1>
                    <h4 className="text-sm sm:text-base md:text-lg text-gray-200 md:max-w-[50%]">
                        Unlock the power of data with hands-on learning! Gain the skills and confidence to tackle independent data science projects, from data analysis to machine learning. Build your expertise and turn raw data into actionable insights for real-world applications.
                    </h4>
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