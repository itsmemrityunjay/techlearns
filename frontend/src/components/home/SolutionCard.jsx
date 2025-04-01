import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { MdOutlineArrowForward } from 'react-icons/md';

const SolutionCard = ({ solution }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/discussion`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="cursor-pointer border border-gray-200 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 bg-white group"
        >
            {/* Image Section */}
            <div
                className="h-48 bg-cover bg-center rounded-t-lg"
                style={{
                    backgroundImage:` url(${solution.avatarUrl})`,
                }}
            >
                <div className="h-full w-full hover:opacity-50 rounded-t-lg transition-opacity duration-300"></div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">{solution.title}</h3>
                    <img
                        src={solution.avatarUrl }
                        alt={solution.author }
                        className="w-12 h-12 rounded-full border"
                    />
                </div>
                <p
                    className="text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(solution.content),
                    }}
                />
         <div className="flex flex-col items-start mt-4">
    <span className="text-sm text-gray-600">By {solution.author || 'Anonymous'}</span>
    <button className="mt-4 w-auto flex items-center justify-start px-4 py-2 bg-[--secondary-color] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group hover:bg-[--primary-color]">
        <span className="group-hover:underline">Read More</span>     <MdOutlineArrowForward className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
    </button>
</div>

            </div>
        </div>
    );
};

const SolutionCards = () => {
    const [solutions, setSolutions] = useState([]);

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
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div className="container mx-auto py-12 px-6">
            {/* Header Section */}
            <div className="text mb-12">
                <h1 className="text-4xl font-bold text-gray-800 uppercase">Solution Write-ups</h1>
                <p className="text-lg text-gray-600 mt-4">
                    Explore the best solutions from top contributors.
                </p>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {solutions.map(solution => (
                    <SolutionCard key={solution.id} solution={solution} />
                ))}
            </div>
        </div>
    );
};

export default SolutionCards;