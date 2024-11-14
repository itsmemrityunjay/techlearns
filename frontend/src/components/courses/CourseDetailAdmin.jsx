import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../database/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import MainHero from '../MainHero';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import TableOfContents from './TableofContent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CourseDetail.css';
import { ToastContainer } from 'react-toastify';

const CourseDetailAdmin = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTocVisible, setTocVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true); // Placeholder: Replace with actual role check
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const docRef = doc(db, 'courses', courseId);
                const courseDoc = await getDoc(docRef);
                if (courseDoc.exists()) {
                    const courseData = courseDoc.data();
                    setCourse(courseData);
                    setSections(Array.isArray(courseData.sections) ? courseData.sections : []);
                } else {
                    setError('Course not found.');
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                setError('Error fetching course data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [courseId]);

    const handleSectionChange = (index, value) => {
        const updatedSections = [...sections];
        updatedSections[index].value = value;
        setSections(updatedSections);
    };

    const saveChanges = async () => {
        if (!course) return;
        try {
            const docRef = doc(db, 'courses', courseId);
            await updateDoc(docRef, { sections });
            // alert("Changes saved successfully!");
            toast.success("Changes saved successfully!");
        } catch (error) {
            console.error("Error saving changes:", error);
            // alert("Error saving changes. Please try again.");
            toast.error("Error saving changes. Please try again.");
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ThreeDots color="#003656" height={80} width={80} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <MainHero
                title={course.title}
                description={course.description}
                image={course.icon}
            />
            <div className="flex mt-6">
                <div
                    className={`w-full md:w-4/5 pr-6 overflow-y-auto overflow-hidden max-h-[80vh] ${isTocVisible ? 'hidden' : 'block'} sm:block scrollbar-hidden scrollbar-thumb-gray-700 scrollbar-track-gray-200`}
                >
                    {course ? (
                        <div className="course-content grid grid-cols-1 gap-6">
                            {sections.length > 0 ? (
                                sections.map((section, index) => (
                                    <div key={index} id={`section-${index}`} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300">
                                        {section.type === 'subHeading' && (
                                            isAdmin && isEditing ? (
                                                <input
                                                    type="text"
                                                    value={section.value}
                                                    onChange={(e) => handleSectionChange(index, e.target.value)}
                                                    className="w-full p-2 border rounded"
                                                />
                                            ) : (
                                                <h3 className="text-2xl font-bold mb-2 mt-5 text-gray-800">
                                                    {section.value}
                                                </h3>
                                            )
                                        )}
                                        {section.type === 'content' && (
                                            isAdmin && isEditing ? (
                                                <ReactQuill
                                                    value={section.value}
                                                    onChange={(value) => handleSectionChange(index, value)}
                                                />
                                            ) : (
                                                <div className="mb-4 text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: section.value }} />
                                            )
                                        )}
                                        {section.type === 'code' && (
                                            isAdmin && isEditing ? (
                                                <textarea
                                                    value={section.value}
                                                    onChange={(e) => handleSectionChange(index, e.target.value)}
                                                    className="w-full p-2 border rounded bg-gray-200 text-sm"
                                                />
                                            ) : (
                                                <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
                                                    <code className="text-sm text-gray-800">{section.value}</code>
                                                </pre>
                                            )
                                        )}
                                        {section.type === 'unorderedList' && (
                                            isAdmin && isEditing ? (
                                                <textarea
                                                    value={section.value.join('\n')}
                                                    onChange={(e) => handleSectionChange(index, e.target.value.split('\n'))}
                                                    className="w-full p-2 border rounded"
                                                />
                                            ) : (
                                                <ul className="list-disc list-outside pl-5 mb-4 text-lg text-gray-800">
                                                    {section.value.map((item, itemIndex) => (
                                                        <li key={itemIndex}>{item}</li>
                                                    ))}
                                                </ul>
                                            )
                                        )}
                                        {section.type === 'orderedList' && (
                                            isAdmin && isEditing ? (
                                                <textarea
                                                    value={section.value.join('\n')}
                                                    onChange={(e) => handleSectionChange(index, e.target.value.split('\n'))}
                                                    className="w-full p-2 border rounded"
                                                />
                                            ) : (
                                                <ol className="list-decimal list-outside pl-4 mb-4 text-lg text-gray-800">
                                                    {section.value.map((item, itemIndex) => (
                                                        <li key={itemIndex}>{item}</li>
                                                    ))}
                                                </ol>
                                            )
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No content available for this course.</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">Course not found</p>
                    )}
                    <p className="text-gray-400 mt-6 text-center">
                        Loaded {sections.length} sections
                    </p>
                </div>

                <div className={`w-1/5 hidden md:block sticky top-20`}>
                    {course && <TableOfContents sections={sections} />}
                </div>
            </div>

            <button
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 sm:hidden"
                onClick={() => setTocVisible(!isTocVisible)}
            >
                {isTocVisible ? '✖' : '☰'}
            </button>

            {isTocVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-white p-6 overflow-y-auto z-40 sm:hidden">
                    <TableOfContents sections={sections} />
                    <button
                        className="absolute top-4 right-4 text-2xl text-blue-500"
                        onClick={() => setTocVisible(false)}
                    >
                        ✖
                    </button>
                </div>
            )}

            {isAdmin && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                    >
                        {isEditing ? 'Finish Editing' : 'Edit Sections'}
                    </button>
                    {isEditing && (
                        <button onClick={saveChanges} className="bg-green-500 text-white px-4 py-2 rounded">
                            Save Changes
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseDetailAdmin;
