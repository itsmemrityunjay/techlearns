import React, { useState, useEffect } from 'react';
import { db } from '../../database/Firebase'; // Firestore database
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // New competition-related icon

const AllCompCard = () => {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const fetchCompetitions = async () => {
            const querySnapshot = await getDocs(collection(db, 'competitions'));
            const competitionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsData);
        };

        fetchCompetitions();
    }, []);

    const isCompetitionLive = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return now >= start && now <= end;
    };

    const navigate = useNavigate();

    return (
        <div className="p-6 secondary-bg ">
            <h1 className="text-3xl text-center text-white mb-8" style={{fontFamily:"raleway"}}>Live Competitions</h1> {/* Heading color updated */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {competitions.map((comp) => {
                    const {
                        id,
                        title,
                        subtitle,
                        privacy,
                        whoCanJoin,
                        prizePool,
                        startDate,
                        startTime,
                        endDate,
                        endTime,
                        status,
                    } = comp;

                    if (status === 'approved' && isCompetitionLive(`${startDate}T${startTime}`, `${endDate}T${endTime}`)) {
                        return (
                            <div
                                key={id}
                                className="w-full max-w-xs bg-white shadow-lg border border-gray-300 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 mx-auto"
                                onClick={() => navigate(`/competition/${comp.id}`)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <EmojiEventsIcon className="text-yellow-500 mr-2" fontSize="large" /> {/* Icon color */}
                                        <h2 className="text-xl font-semibold text-yellow-500">{title}</h2> {/* Title color updated */}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{subtitle}</p>

                                    <div className="text-gray-700 text-sm space-y-1">
                                        <p><strong>Start:</strong> {new Date(`${startDate}T${startTime}`).toLocaleString()}</p>
                                        <p><strong>End:</strong> {new Date(`${endDate}T${endTime}`).toLocaleString()}</p>
                                        <p><strong>Privacy:</strong> {privacy}</p>
                                        <p><strong>Who Can Join:</strong> {whoCanJoin}</p>
                                        <p><strong>Prize Pool:</strong> {prizePool}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

export default AllCompCard;
