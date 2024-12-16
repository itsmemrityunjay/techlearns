import React, { useEffect, useState } from 'react';
import { Star } from '@mui/icons-material';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useNavigate } from 'react-router-dom';
// Import DOMPurify to sanitize HTML
import DOMPurify from 'dompurify';

const SolutionCards = () => {
    const [solutions, setSolutions] = useState([]);
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            const topicsRef = collection(db, 'topics');
            const q = query(topicsRef, orderBy('createdAt', 'desc'), limit(4)); // Limit to 4 latest topics
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
        <div className='container mx-auto py-8'>
            <div className="flex items-center mb-4">
                <h1 className="text-3xl font-bold mb-4 flex items-center uppercase text-customBlue">Solution Write-ups</h1>
                <Star className="mr-2 ml-4 text-customBlue mb-4" fontSize='large' />
            </div>
            <p className="mb-8">Read the best solutions from top contributors.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {solutions.map(solution => (
                    <div
                        key={solution.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow hover:shadow-lg hover:scale-105 duration-200"
                        onClick={() => navigate(`/discussion`)}
                    >
                        <div className="block p-6">
                            <div className="flex items-center mb-4">
                                <div
                                    style={{ backgroundImage: `url(${solution.avatarUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'})` }}
                                    className="h-12 w-12 bg-cover bg-center rounded-full mr-4"
                                    title={solution.author || 'Unknown'}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">{solution.title}</h2>
                                    <p className="text-gray-600">By {solution.author || 'Anonymous'}</p>
                                </div>
                            </div>
                            {/* Render HTML safely and limit the lines */}
                            <p
                                className="mt-4 text-gray-700 line-clamp-5"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(solution.content),
                                }}
                            />
                            <p className="mt-2 text-blue-500 cursor-pointer">...Read More</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolutionCards;
