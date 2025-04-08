// components/comp/Mentors.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, BookOpen, Code, User } from 'lucide-react';

const Mentors = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);

    const mentors = [
        {
            id: 1,
            name: "John Doe",
            role: "Senior Developer",
            image: "path/to/image",
            expertise: ["React", "Node.js", "Python"],
            bio: "10+ years of experience in web development",
            about: "Passionate about teaching and mentoring junior developers.",
            topics: ["Web Development", "System Design", "Data Structures"],
            skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
            experience: [
                {
                    company: "Tech Corp",
                    role: "Senior Developer",
                    duration: "2019 - Present",
                    description: "Leading development team and mentoring juniors"
                },
                {
                    company: "StartUp Inc",
                    role: "Full Stack Developer",
                    duration: "2016 - 2019",
                    description: "Developed full stack applications"
                }
            ]
        },
        // Add more mentors
    ];

    const MentorCard = ({ mentor }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center"
        >
            <div className="relative w-32 h-32 mx-auto mb-4">
                <img 
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{mentor.name}</h3>
            <p className="text-blue-600 font-medium mb-3">{mentor.role}</p>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {mentor.expertise.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {skill}
                    </span>
                ))}
            </div>
            <button
                onClick={() => setSelectedMentor(mentor)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                View Profile
            </button>
        </motion.div>
    );

    const MentorModal = ({ mentor, onClose }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{mentor.name}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-6">
                        <img 
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{mentor.name}</h3>
                            <p className="text-blue-600 font-medium">{mentor.role}</p>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 text-lg font-semibold mb-3">
                            <User className="w-5 h-5" />
                            <h3>About</h3>
                        </div>
                        <p className="text-gray-600">{mentor.about}</p>
                    </div>

                    {/* Topics */}
                    <div>
                        <div className="flex items-center space-x-2 text-lg font-semibold mb-3">
                            <BookOpen className="w-5 h-5" />
                            <h3>Topics</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mentor.topics.map((topic, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <div className="flex items-center space-x-2 text-lg font-semibold mb-3">
                            <Code className="w-5 h-5" />
                            <h3>Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mentor.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <div className="flex items-center space-x-2 text-lg font-semibold mb-3">
                            <Briefcase className="w-5 h-5" />
                            <h3>Work Experience</h3>
                        </div>
                        <div className="space-y-4">
                            {mentor.experience.map((exp, index) => (
                                <div key={index} className="border-l-2 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-gray-800">{exp.role}</h4>
                                    <p className="text-blue-600">{exp.company}</p>
                                    <p className="text-sm text-gray-500">{exp.duration}</p>
                                    <p className="text-gray-600 mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-center mb-12"
            >
                Meet Our Mentors
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                ))}
            </div>

            <AnimatePresence>
                {selectedMentor && (
                    <MentorModal 
                        mentor={selectedMentor} 
                        onClose={() => setSelectedMentor(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentors;