import React from 'react';

const TechSection = () => {
    const profiles = [
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/women/1.jpg', borderColor: 'border-green-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/men/2.jpg', borderColor: 'border-blue-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/women/3.jpg', borderColor: 'border-yellow-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/men/4.jpg', borderColor: 'border-orange-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/women/5.jpg', borderColor: 'border-red-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/men/6.jpg', borderColor: 'border-purple-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/women/7.jpg', borderColor: 'border-pink-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/men/8.jpg', borderColor: 'border-indigo-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/women/9.jpg', borderColor: 'border-teal-400' },
        { imgSrc: 'https://randomuser.me/api/portraits/thumb/men/10.jpg', borderColor: 'border-green-400' },
    ];

    return (
        <div className="relative flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-lg shadow-lg w-full max-w-8xl mt-7 mb-7 container mx-auto py-8">
            {/* Left Section - Text */}
            <div className="md:w-1/2 p-6">
                <h2 className="text-3xl font-bold mb-4">Who are Kagglers?</h2>
                <p className="text-gray-600 text-base">
                    Kagglers come from all walks of life: students, seasoned professionals, and distinguished researchers. They use Kaggle to learn data science & ML, stay up-to-date on the latest techniques, and collaborate.
                </p>
            </div>

            {/* Right Section - Profile Images */}
            <div className="md:w-1/2 grid grid-cols-5 gap-y-4 gap-x-2 relative">
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${profile.borderColor} overflow-hidden`}
                    >
                        <img
                            src={profile.imgSrc}
                            alt={`Kaggler ${index}`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                ))}

                {/* Bottom Right Decorative Shapes */}
                {/* <div className="absolute bottom-[-20px] right-[-30px] w-24 h-24 bg-blue-500 rounded-tr-[60px] z-10"></div>
                <div className="absolute bottom-[-10px] right-[-50px] w-28 h-28 bg-yellow-400 rounded-bl-[80px] z-0"></div> */}
            </div>
        </div>
    );
};

export default TechSection;
