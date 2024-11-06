import React from 'react';

const InfoSection = () => {
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Global Community Section */}
                <div className="p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">A global community</h2>
                    <p className="text-gray-600 mb-4">Over 20 million users from over 190 countries are here.</p>
                    <p className="font-bold text-lg">NL PL JP CA IT</p>
                    <p className="font-bold text-lg">BR AU AR TH EG</p>
                </div>

                {/* Home for Everyone Section */}
                <div className="p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">A home for everyone</h2>
                    <p className="text-gray-600 mb-4">
                        The KaggleX Mentorship Program is committed to creating a more inclusive data science community.
                    </p>
                    <div className="text-3xl font-bold text-blue-500">Kaggle<span className="text-blue-400">X</span></div>
                </div>

                {/* Discussion Section */}
                <div className="p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">A place to discuss ML</h2>
                    <p className="text-gray-600 mb-4">
                        Whether you're a beginner or pro, find answers to your ML questions & connect with ML enthusiasts on Kaggle's forums.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Data Visualization</span>
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Neural Networks</span>
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">Computer Vision</span>
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">NLP</span>
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">→ See All</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;