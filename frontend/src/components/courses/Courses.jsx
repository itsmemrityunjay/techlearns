import React, { useState, useEffect } from 'react';
import { db } from '../../database/Firebase'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';




// CourseCard Component
const CourseCard = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="flex items-start p-4 dark:bg-gray-800 dark:text-white text-dark rounded-md mb-4 cursor-pointer hover:shadow-lg transition-shadow">
        <div className="text-3xl mr-4"><img src={icon} alt="icon" /></div>
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>
    </div>
);

const Courses = () => {
    const [firebaseCourses, setFirebaseCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const fetchedCourses = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFirebaseCourses(fetchedCourses);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };
        fetchCourses();
    }, []);

    const allCourses = [...firebaseCourses];

    return (
        <div className='container mx-auto py-8'>
            <div className="h-auto dark:bg-gray-900">
                <h1 className="text-3xl font-bold dark:text-white mb-8">Courses</h1>
                <p className="text-gray-400 mb-6">
                    We pare down complex topics to their key practical components, so you gain usable skills in a few hours (instead of weeks or months). The courses are provided at no cost to you, and you can now earn certificates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course) => (
                        <CourseCard
                            key={course.id || course.title}
                            title={course.title}
                            description={course.description}
                            icon={course.icon || '📘'}
                            onClick={() => navigate(`/courses/${course.id || course.title}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;