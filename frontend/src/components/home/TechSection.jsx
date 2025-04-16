import React from 'react';
import img from "../..//assets/NIs-2.jpg"
import img1 from "../../assets/Shital.jpg"
import img2 from "../../assets/sujal.jpg"
import img3 from "../../assets/aryan.jpg"
import img4 from "../../assets/niraj.jpeg"
import img5 from "../../assets/riya.jpeg"
import img6 from "../../assets/lalan.jpg"
import img7 from "../../assets/aman.jpeg"
import img8 from "../../assets/raj.jpg"
import img9 from "../../assets/krishna.jpg"
const TechSection = () => {
    const profiles = [
        { imgSrc: img, borderColor: 'border-green-400' },
        { imgSrc: img1, borderColor: 'border-blue-400' },
        { imgSrc: img2, borderColor: 'border-yellow-400' },
        { imgSrc: img3, borderColor: 'border-orange-400' },
        { imgSrc: img4, borderColor: 'border-red-400' },
        { imgSrc: img5, borderColor: 'border-purple-400' },
        { imgSrc: img6, borderColor: 'border-pink-400' },
        { imgSrc: img7, borderColor: 'border-indigo-400' },
        { imgSrc: img8, borderColor: 'border-teal-400' },
        { imgSrc: img9, borderColor: 'border-green-400' },
    ];

    return (
        <div className="relative flex flex-col md:flex-row justify-between items-center p-16 rounded-none w-screen max-w-full mt-12 mb-12 overflow-hidden">
            {/* Decorative Top Left Element */}
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30 blur-3xl"></div>

            {/* Left Section - Text */}
           {/* Left Section - Text */}
<div className="md:w-1/2 px-10 space-y-8 z-10">
    <h2 className="text-6xl font-extrabold text-gray-800 leading-tight">
        Meet the <span className="text-[--primary-color]">Tech<span className="text-[--secondary-color]">learns</span></span>
    </h2>
    <p className="text-gray-600 text-lg leading-relaxed">
        Techlearns are passionate data scientists, machine learning experts, and innovators from around the globe. They collaborate, learn, and grow together while solving real-world challenges in data science.
    </p>
    <a 
        href="https://chat.whatsapp.com/HYOloogGXKcIkR83DnOjFj" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 text-white bg-[--secondary-color] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all hover:bg-[--primary-color] cursor-pointer"
    >
        Join the Community
    </a>
</div>

            {/* Right Section - Profile Images */}
            <div className="md:w-1/2 grid grid-cols-5 gap-y-8 gap-x-6 relative z-10">
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${profile.borderColor} overflow-hidden transform hover:scale-110 hover:rotate-3 transition-transform`}
                    >
                        <img
                            src={profile.imgSrc}
                            // alt={Kaggler `${index}`}
                            className="w-full h-full object-cover rounded-full shadow-md"
                        />
                    </div>
                ))}

                {/* Decorative Bottom Right Elements */}
         
            
            </div>

            {/* Full-Width Decorative Background */}
            <div className="absolute inset-0 -z-10 opacity-60"></div>
        </div>
    );
};

export default TechSection;