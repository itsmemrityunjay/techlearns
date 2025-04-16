import React from 'react';

const InfoSection = () => {
    return (
        <div className="container mx-auto py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Global Community Section */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-extrabold mb-4 text-[#ffaa00] dark:text-blue-400">
                        A Global Community
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Over 20 million users from 190+ countries are part of this thriving community.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-lg font-bold">
                        <p>NL PL JP CA IT</p>
                        <p>BR AU AR TH EG</p>
                    </div>
                </div>

                {/* Home for Everyone Section */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-4 text-[#ffaa00] dark:text-purple-400">
                        A Home for Everyone
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        The Techlearns Mentorship Program is committed to fostering a more inclusive data science community.
                    </p>
                    <div className="text-4xl font-extrabold text-[#ffaa00] dark:text-blue-300">
                        Tech<span className="text-[--secondary-color] dark:text-blue-200">learns</span>
                    </div>
                </div>

                {/* Discussion Section */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-4 text-[#ffaa00] dark:text-blue-400">
                        A Place to Discuss Skills
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Whether you're a beginner or a pro, find answers to your ML questions and connect with enthusiasts on Techlearns's forums.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['Data Visualization', 'Neural Networks', 'Computer Vision', 'NLP', '→ See All'].map((tag, index) => (
                            <span
                                key={index}
                                className="bg-[--secondary-color] dark:bg-[#ffaa00] text-white dark:text-blue-300 px-4 py-1 text-sm font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;