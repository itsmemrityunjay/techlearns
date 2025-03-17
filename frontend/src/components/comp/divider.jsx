import React from 'react';
import bgimg from '../../components/comp/bg.jpg';

const Divider = () => {
  return (
    <div
      className="flex flex-col justify-center items-start p-6 mt-10 rounded-2xl bg-cover bg-center bg-no-repeat min-h-[220px] md:min-h-[300px]"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <h1 className="text-[6vw] md:text-4xl font-semibold text-gray-800 mb-4">
        New to TechLearns?
      </h1>
      <p className="text-[4vw] md:text-lg text-gray-600 max-w-[90%] md:max-w-[600px] leading-relaxed">
        TechLearns offers a variety of beginner-friendly competitions designed to help you learn data science and machine learning through hands-on experience.
      </p>
    </div>
  );
};

export default Divider;