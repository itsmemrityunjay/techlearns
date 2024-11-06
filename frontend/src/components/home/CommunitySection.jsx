import React from 'react';

const CommunitySection = () => {
    return (
        <div className="min-h-full bg-white flex flex-col lg:flex-row items-center justify-between container mx-auto py-8 ">

            {/* Left Side: Text */}
            <div className="lg:w-1/2 flex flex-col mx-2 space-y-6 text-left lg:text-left">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
                    Build your ML skills in a supportive and helpful community
                </h1>
                <p className="text-lg lg:text-xl text-gray-600">
                    Kaggle's community is a diverse group of 20 million data scientists, ML engineers & enthusiasts from around the world.
                </p>
            </div>

            {/* Right Side: Browser Mockup */}
            <div className="relative lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0">

                {/* Background Overlapping Circles */}
                {/* <div className="absolute w-40 h-40 bg-yellow-300 rounded-full overflow-hidden -bottom-10 -right-10 opacity-70"></div>
                <div className="absolute w-40 h-40 bg-blue-400 rounded-full overflow-hidden -top-8 -right-16 opacity-70"></div> */}

                {/* Browser Mockup */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-2xl relative z-10">
                    {/* Mockup Header with Circles */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>

                    {/* Mockup Content */}
                    <div className="carousel carousel-vertical rounded-box h-96">
                        <div className="carousel-item w-full">
                            <img src="https://www.kaggle.com/static/images/home/logged-out/datasets-landing@1.png" />
                        </div>
                        <div className="carousel-item w-full">
                            <img src="https://www.kaggle.com/static/images/home/logged-out/notebooks-landing@1.png" />
                        </div>
                        <div className="carousel-item w-full">
                            <img src="https://www.kaggle.com/static/images/home/logged-out/models-landing@1.png" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


export default CommunitySection;