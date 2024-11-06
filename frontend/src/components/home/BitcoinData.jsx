import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../database/Firebase'; // Adjust this path to your firebase configuration
import DataArrayIcon from '@mui/icons-material/DataArray'; // Import Material UI icon
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'competitions'));
                const fetchedCourses = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                // Get the latest four courses
                const latestCourses = fetchedCourses.slice(-4);
                setCourses(latestCourses);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };
        fetchCourses();
    }, []);

    // Helper function to truncate text to a specified word limit
    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <DataArrayIcon className="mr-2" /> {/* Material UI icon */}
                Competitions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                Recent competition challenges to test your skills and win prizes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((data) => (
                    <Link
                        key={data.id}
                        to={`/competition/${data.id}`} // Use {} for dynamic expression
                        className="block border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 m-2"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{data.title}</h3>
                            <img
                                src={data.icon}
                                alt={data.title}
                                className="w-12 h-12 object-cover rounded-full"
                            />
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            Prize <span className="font-bold">{data.prizePool}</span> · {data.size}
                        </div>
                        <p className="text-gray-500">{truncateText(data.subtitle, 20)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
