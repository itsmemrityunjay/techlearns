import React, { useState, useEffect } from 'react';
import { db } from '../../database/Firebase'; // Firestore database
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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

        // Check if the current date is within the start and end date range
        return now >= start && now <= end;
    };

    const navigate = useNavigate();

    return (
        <div className="">
            <h1 className="text-3xl font-bold mb-6">Live Competitions</h1>
            <div className="grid grid-cols-1 gap-6">
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

                    // Show only approved and live competitions
                    if (status === 'approved' && isCompetitionLive(`${startDate}T${startTime}`, `${endDate}T${endTime}`)) {
                        return (
                            <div key={id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/competition/${comp.id}`)}>
                                <h2 className="text-xl font-bold">{title}</h2>
                                <p className="text-gray-600">{subtitle}</p>
                                <p>Start: {new Date(`${startDate}T${startTime}`).toLocaleString()}</p>
                                <p>End: {new Date(`${endDate}T${endTime}`).toLocaleString()}</p>
                                <p>Privacy: {privacy}</p>
                                <p>Who Can Join: {whoCanJoin}</p>
                                <p>Prize Pool: {prizePool}</p>
                            </div>
                        );
                    }

                    return null; // Hide if not live or not approved
                })}
            </div>
        </div>
    );
};

export default AllCompCard;
