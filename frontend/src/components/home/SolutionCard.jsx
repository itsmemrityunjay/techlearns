import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { MdOutlineArrowForward, MdOutlineBookmark, MdBookmark } from 'react-icons/md';
import { FiEye, FiMessageSquare } from 'react-icons/fi';

const SolutionCard = ({ solution }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCardClick = () => {
        navigate(`/discussion`);
    };

    const toggleBookmark = (e) => {
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer border border-gray-100 rounded-xl shadow-sm transition-all duration-300 bg-white group hover:shadow-lg hover:border-transparent flex flex-col h-full"
        >
            {/* Image Section with Overlay */}
            {/* <div className="relative h-48 bg-cover bg-center rounded-t-xl overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${solution.avatarUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/20" /> */}
                
                {/* Bookmark Button */}
                {/* <button 
                    onClick={toggleBookmark}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all"
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this solution"}
                >
                    {isBookmarked ? (
                        <MdBookmark className="text-yellow-500 text-xl" />
                    ) : (
                        <MdOutlineBookmark className="text-gray-600 text-xl" />
                    )}
                </button> */}
                
                {/* Author Badge */}
                {/* <div className="absolute bottom-4 left-4 flex items-center">
                    <img
                        src={solution.avatarUrl}
                        alt={solution.author}
                        className="w-9 h-9 rounded-full border-2 border-white"
                    />
                    <span className="ml-2 text-sm font-medium text-white">
                        {solution.author || 'Anonymous'}
                    </span>
                </div> */}
            {/* </div> */}

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Category Tag */}
                <div className="flex justify-between items-center mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-100 text-black rounded-full">
                        {solution.category || 'General'}
                    </span>
                    <div className="flex items-center space-x-3 text-gray-500 text-xs">
                        <span className="flex items-center">
                            <FiEye className="mr-1" /> {solution.views || 0}
                        </span>
                        <span className="flex items-center">
                            <FiMessageSquare className="mr-1" /> {solution.comments?.length || 0}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[--secondary-color] transition-colors">
                    {solution.title}
                </h3>
                

                {/* Content Preview */}
                <div
                    className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(solution.content),
                    }}
                />

                {/* Read More Button */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-500">
                        {solution.createdAt?.toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <button 
                        className="flex items-center text-sm font-medium text-[--secondary-color] hover:text-blue-800 transition-colors"
                        onClick={handleCardClick}
                    >
                        Read more
                        <MdOutlineArrowForward className={`ml-1 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SolutionCards = () => {
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopics = async () => {
        try {
            const topicsRef = collection(db, 'topics');
            const q = query(topicsRef, orderBy('createdAt', 'desc'), limit(4));
            const querySnapshot = await getDocs(q);

            const topicsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSolutions(topicsData);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 sm:px-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl h-[420px] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 max-w-7xl">
            {/* Header Section */}
            <div className="text-left mb-12 px-4">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Solution <span className="text-[#ffaa00]">Write-ups</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                    Discover expert solutions and insights from our community of problem solvers.
                </p>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                {solutions.map(solution => (
                    <SolutionCard key={solution.id} solution={solution} />
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
               
            </div>
        </div>
    );
};

export default SolutionCards;