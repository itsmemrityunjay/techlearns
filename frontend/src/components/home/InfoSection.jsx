import React from 'react';

const InfoSection = () => {
    return (
        <div className="container mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* New Education Policy Section */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-extrabold mb-4 text-black dark:text-blue-400">
                        Based on <span className='text-[#ffaa00]'>New Education Policy</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Our courses are designed in alignment with the New Education Policy (NEP 2020), focusing on holistic, multidisciplinary learning that encourages critical thinking and practical application from a young age.
                    </p>
                </div>

                {/* Skill India Section 1 */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-4 text-black dark:text-purple-400">
                        Empowering <span className='text-[#ffaa00]'>Youth</span> through Skills
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        With the Skill India Mission, we aim to nurture a generation of skilled professionals by offering hands-on training, real-world projects, and industry-recognized certifications.
                    </p>
                </div>

                {/* Skill India Section 2 */}
                <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-4 text-black dark:text-blue-400">
                        Building a <span className='text-[#ffaa00]'>Skilled Nation</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We believe in creating a future-ready workforce. Our programs under Skill India are tailored to meet industry needs and promote entrepreneurship, self-reliance, and innovation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
