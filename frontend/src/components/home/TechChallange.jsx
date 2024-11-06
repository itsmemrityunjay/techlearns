import React, { useState, useEffect } from 'react';

const TechChallenge = () => {
    // Countdown logic
    const calculateTimeLeft = () => {
        const endDate = new Date('2024-06-14');
        const now = new Date();
        const difference = endDate - now;

        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    return (
        <div className="min-h-full bg-gray-50 py-10 px-2 lg:px-20">
            <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center">
                {/* Left Section */}
                <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
                    <div className=" py-8 rounded-lg">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Learn cutting edge techniques in Kaggle competitions & courses
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Kaggle competitions and courses provide a real-world setting to
                            apply what you learn & connect with other ML practitioners.
                        </p>
                    </div>

                    <div className="mt-8 bg-white p-8 shadow-md rounded-lg grid grid-cols-3 gap-4 text-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">28,000</h2>
                            <p className="text-gray-600">Competitions</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">5,000</h2>
                            <p className="text-gray-600">Write-ups</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">70+ hours</h2>
                            <p className="text-gray-600">Courses</p>
                        </div>
                    </div>
                </div>


                <div className="relative lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0">

                    {/* Background Overlapping Circles */}
                    {/* <div className="absolute w-60 h-60 bg-yellow-300 rounded-full overflow-hidden -bottom-10 -right-10 opacity-70"></div>
                    <div className="absolute w-60 h-60 bg-blue-400 rounded-full overflow-hidden -top-8 -right-16 opacity-70"></div> */}

                    {/* Browser Mockup */}
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-2xl relative z-10">
                        {/* Mockup Header with Circles */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>

                        {/* Mockup Content */}
                        <div className="p-6">
                            <div className="carousel carousel-vertical rounded-box h-96">
                                <div className="carousel-item w-full">
                                    <img src="https://www.kaggle.com/static/images/home/logged-out/datasets-landing@1.png" alt='image1' />
                                </div>
                                <div className="carousel-item w-full">
                                    <img src="https://www.kaggle.com/static/images/home/logged-out/notebooks-landing@1.png" alt='image2' />
                                </div>
                                <div className="carousel-item w-full">
                                    <img src="https://www.kaggle.com/static/images/home/logged-out/models-landing@1.png" alt='image3' />
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// const ForumItem = ({ title, description, time, newReplies, users }) => (
//     <div className="flex justify-between items-start">
//         <div>
//             <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//             <p className="text-gray-600">{description}</p>
//             <p className="text-sm text-gray-400">{time}</p>
//         </div>
//         <div className="flex items-center space-x-2">
//             <div className="text-blue-500">{newReplies}</div>
//             <div className="flex space-x-1">
//                 {users.map((user, index) => (
//                     <div key={index} className="w-6 h-6 bg-gray-200 rounded-full"></div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

export default TechChallenge;