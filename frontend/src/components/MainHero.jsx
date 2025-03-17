import React from 'react';
import nb from "../components/comp/nb.jpg";
const MainHero = ({ title, description, image }) => {
    return (
        <div className="flex justify-center items-center bg-white"
        style={{
            backgroundImage:` url(${nb})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          
        }}
        >
            <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-8xl shadow-lg p-6 rounded-lg">
                <div className="flex-1 mb-6 md:mb-0 mt-14 justify-center items-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 ml-6">{title}</h1>
                    <p className="text-gray-600 mb-6 ml-6">
                        {description}{' '}
                    </p>
                </div>
                <div className="flex-shrink-0 mr-6">
                    <img src={image} alt="Course" width="280" height="208" className="w-72 h-auto" />
                </div>
            </div>
        </div>
    );
};

export default MainHero;
