import React, { useState, useEffect } from 'react';
import SkillIndia from "../../assets/SkillIndia.png";
import NEP from "../../assets/NEP.png";

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
        <div className="min-h-full py-10 ">
            <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center">
                {/* Left Section */}
                <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
                    <div className="py-8 flex flex-col justify-between">
                        <h1 className="text-5xl leading-normal py-10 font-bold">
                            Empowering Learners with <br /> <span className='text-[#ffaa00]'>Skill India</span>  & <span className='text-[#ffaa00]'>NEP</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Our content and courses are aligned with Skill India and the New Education Policy,
                            offering engaging competitions and skill-based learning for both elementary school
                            and undergraduate students.
                        </p>
                    </div>

                    <div className="mt-10 mb-5 grid grid-cols-3 gap-3">
                        <div>
                            <h2 className="text-3xl font-bold">1,000+</h2>
                            <p className="font-bold py-2">COMPETITIONS</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">500+</h2>
                            <p className="font-bold py-2">NOTEBOOKS</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">5+ hrs</h2>
                            <p className="font-bold py-2">COURSES</p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="relative lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0">
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-2xl relative z-10">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>

                        <div className="p-6">
                            <div className="carousel carousel-vertical rounded-box h-96">
                                <div className="carousel-item w-full">
                                    <img src={SkillIndia} alt='image1' />
                                </div>
                                <div className="carousel-item w-full">
                                    <img src={NEP} alt='image2' />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechChallenge;
