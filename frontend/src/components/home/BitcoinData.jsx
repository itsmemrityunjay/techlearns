import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../database/Firebase'; // Adjust this path to your firebase configuration
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import imageshero from "../../assets/imghome.jpg";
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
    <h1 className="text-3xl font-bold mb-4 flex items-center uppercase text-customBlue">
        Competitions
        <EmojiEventsIcon className="mr-2 ml-4 text-customBlue" fontSize="large" />
    </h1>
    <p className="text-lg text-gray-600 mb-6">
        "Showcase your talent with exciting competition challenges. Compete, learn, and win amazing prizes!"
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((data) => (
            <Link
                key={data.id}
                to={`/competition/${data.id}`}
                className="relative  transition-all rounded-lg p-4 m-2 
                           before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:to-white
                           before:opacity-0 before:transition-opacity before:duration-300 
                           hover:before:opacity-100 hover:bg-white hover:shadow-xl
                           transform hover:scale-105 hover:-translate-y-2"
            >
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <img
                        src={data.icon}
                        alt={data.title}
                        className="h-12 w-auto max-w-full object-contain"
                    />
                </div>

                <h3 className="text-lg font-bold text-customBlue uppercase mb-5 relative z-10">{data.title}</h3>
                <hr className="border-t border-gray-300 relative z-10" />
                <div className="text-sm text-gray-600 mb-2 font-bold mt-5 relative z-10">
                    Prize <span className="font-bold">{data.prizePool}</span> · {data.size}
                </div>
                <p className="text-gray-500 relative z-10">{truncateText(data.subtitle, 20)}</p>
            </Link>
        ))}
    </div>
</div>

    );
};

export default CourseList;
