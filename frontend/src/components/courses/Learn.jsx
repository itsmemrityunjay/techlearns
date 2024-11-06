import React from 'react';
import Courses from './Courses.jsx';
import Guides from './Guides';
import HeroImg from "../../assets/course.svg"

const LearnSection = () => {
    return (
        <>
            <div className="flex justify-center items-center mb-8">
                <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-8xl bg-white shadow-lg p-6 rounded-lg">

                    {/* Left Section - Title and Description */}
                    <div className="flex-1 mb-6 md:mb-0 mt-14">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 ml-6">
                            Learn
                        </h1>
                        <p className="text-gray-600 mb-6 ml-6">
                            Gain the skills you need to do independent data science projects.
                        </p>
                    </div>

                    {/* Right Section - Image */}
                    <div className="flex-shrink-0 mr-6">
                        <img
                            src={HeroImg}
                            alt="Competitions"
                            width="480"
                            height="408"
                            className="w-96 h-auto"
                        />
                    </div>

                </div>
            </div>


            <Courses />
            {/* <Guides /> */}
        </>
    );
};

export default LearnSection;