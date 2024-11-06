import React, { useState, useEffect } from 'react';
import { db } from '../../database/Firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import FlagIcon from '@mui/icons-material/Flag';

const TechGetStarted = () => {
    const [competitions, setCompetitions] = useState([]);

    // Fetch recent competitions from Firestore
    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                // Get the most recent 3 competitions
                const competitionsRef = collection(db, 'competitions');
                const recentCompetitionsQuery = query(competitionsRef, orderBy('createdAt', 'desc'), limit(3));
                const querySnapshot = await getDocs(recentCompetitionsQuery);
                const competitionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompetitions(competitionsData);
            } catch (error) {
                console.error("Error fetching competitions:", error);
            }
        };
        fetchCompetitions();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <div className="py-8">
                {/* Header with flag icon */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <FlagIcon className="text-lg mr-2" />
                        <h2 className="text-lg font-semibold">Get Started</h2>
                    </div>
                    <a
                        href="#"
                        className="text-sm text-blue-500 hover:bg-gray-900 hover:text-white px-2 py-1 rounded transition-colors duration-200"
                    >
                        See all
                    </a>
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-1'>
                    <div>
                        <h3 className="text-2xl font-medium mb-4">New to Kaggle?</h3>
                        <p className="mb-8 text-lg text-gray-500">These competitions are perfect for newcomers.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-3">
                        {competitions.map((comp, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                <img src={comp.icon} alt={comp.title} className="w-full h-40 object-cover rounded-t-lg" />
                                <div className="p-4">
                                    <h4 className="text-md font-semibold mb-2">{comp.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4">{comp.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                        <span>{comp.status}</span>
                                        <span>{comp.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">{comp.prizePool}</span>
                                        <span className="text-sm text-green-500">{comp.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechGetStarted;
