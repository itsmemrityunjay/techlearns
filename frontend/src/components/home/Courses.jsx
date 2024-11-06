import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import { db } from '../../database/Firebase'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    // Redirect to the course detail page when the card is clicked
    const handleCardClick = () => {
        navigate(`/courses/${course.id}`);
    };

    return (
        <div onClick={handleCardClick} className="cursor-pointer">
            <a
                href={course.link}
                className="block bg-white border border-gray-200 rounded-lg shadow-md transition-shadow transform hover:shadow-lg hover:scale-105 duration-200 p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold">{course.title}</div>
                    <img
                        src={course.icon}
                        title={course.title}
                        width="48"
                        height="48"
                        alt={course.title}
                        className="ml-2 rounded-full border border-gray-200"
                    />
                </div>
                <div className="text-gray-500 mb-2">
                    <p className="text-sm">{course.duration}</p>
                </div>
                <p className="text-gray-600 text-sm">{course.description}</p>
            </a>
        </div>
    );
};

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
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

    return (
        <div className="container mx-auto py-8">
            {/* Heading Section */}
            <div className="flex items-center mb-4">
                <SchoolIcon fontSize="large" className="text-black-500 mr-2" /> {/* Course Icon */}
                <h1 className="text-2xl font-bold">Courses</h1> {/* Bold Heading */}
            </div>
            <p className="text-gray-600 mb-6">
                Earn a signed certificate and learn new techniques in our no cost, hands-on courses.
            </p>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseList;
