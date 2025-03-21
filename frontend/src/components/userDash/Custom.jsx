import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { db } from "../../database/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getUserData } from '../../database/Firebase';  // Import the getUserData function
import Footer from '../comp/footer'; import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { use } from 'react';

const CustomComponent = () => {
    const [user, setUser] = useState(null);  // Store user info
    const [notebooks, setNotebooks] = useState([]);  // Store user's notebooks
    const [userData, setUserData] = useState({
        notebooks: [],
        topics: [],
        competitions: [],
        email: '',
    });  // Store user's notebooks, topics, competitions

    // Fetch the authenticated user's data
    useEffect(() => {
        const auth = getAuth();
        const storage = getStorage();

        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);
                const fetchedUserData = await getUserData(loggedInUser.uid);

                let profileImageUrl = fetchedUserData.profileImageUrl;

                // Convert gs:// URL to a public URL
                if (profileImageUrl && profileImageUrl.startsWith("gs://")) {
                    const storageRef = ref(storage, profileImageUrl.replace("gs://", ""));
                    profileImageUrl = await getDownloadURL(storageRef);
                }

                setUserData({
                    photoURL: profileImageUrl,
                    notebooks: fetchedUserData.notebooks || [],
                    topics: fetchedUserData.topics || [],
                    competitions: fetchedUserData.competitions || [],
                    email: fetchedUserData.email,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Clean up on unmount
    }, []);


    useEffect(() => {
        const fetchNotebooks = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "notebooks"));
                const notebooksData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Filter notebooks based on the user's email
                const userNotebooks = notebooksData.filter(notebook => notebook.author === userData.email);

                setNotebooks(userNotebooks);
            } catch (error) {
                console.error("Error fetching Notebooks:", error);
            }
        };

        if (userData.email) {
            fetchNotebooks();
        }
    }, [userData.email]);  // Fetch only when userData.email is available





    const months = [
        { name: 'Oct', days: 31 },
        { name: 'Nov', days: 30 },
        { name: 'Dec', days: 31 },
        { name: 'Jan', days: 31 },
        { name: 'Feb', days: 28 },
        { name: 'Mar', days: 31 },
        { name: 'Apr', days: 30 },
        { name: 'May', days: 31 },
        { name: 'Jun', days: 30 },
        { name: 'Jul', days: 31 },
        { name: 'Aug', days: 31 },
        { name: 'Sep', days: 30 },
    ];

    // Example active days logic
    const activeDays = [
        { month: 8, day: 27 }, // Example: August 27th
        { month: 7, day: 2 },  // Example: July 2nd
        { month: 7, day: 6 },  // Example: July 6th
        { month: 9, day: 10 }, // Example: September 10th
    ];

    return (
        <div className='container mx-auto py-8'>
            <section className="relative pt-40 pb-24">
                <img
                    src="https://pagedone.io/asset/uploads/1705473378.png"
                    alt="cover-image"
                    className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
                />
                <div className="w-full max-w-8xl bg-white rounded-lg mx-auto py-8 px-6 md:px-8">
                    <div className="flex items-center justify-center sm:justify-start relative rounded-lg z-10 mb-5">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                alt="user-avatar-image"
                                className="border-4 h-32 w-32 border-solid border-white object-cover"
                            />
                        ) : (
                            <p>Loading...</p>
                        )}

                    </div>
                    <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                        <div className="block">
                            <h3 className="font-manrope font-bold text-4xl text-gray-900 mb-1">
                                {user ? user.displayName || user.email : "Guest User"}
                            </h3>
                            <p className="font-normal text-base leading-7 text-gray-500">Rank: 12,33,543</p>
                        </div>
                        <button
                            className="rounded-full py-3.5 px-5 bg-blue-100 flex items-center group transition-all duration-500 hover:bg-indigo-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    className="stroke-gray-700 transition-all duration-500 group-hover:stroke-indigo-600"
                                    d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                    stroke="orange" strokeWidth="1.6" strokeLinecap="round"
                                />
                            </svg>
                            <span
                                className="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500 "
                            >
                                Software Engineer
                            </span>
                        </button>
                    </div>
                    <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                        <div className="flex items-center gap-4">
                            <button
                                className="py-3.5 px-5 rounded-full text-black font-semibold text-base leading-7  shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-[--secondary-color]"
                            >
                                <Link to="/edit-profile">Edit Profile</Link>
                            </button>
                            {/* <button
                                className="py-3.5 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100"
                            >
                                Settings
                            </button> */}
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="flex items-center gap-2 font-medium text-lg leading-8 primary-text">
                                Skills
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.78135 5.55191C9.4453 3.5173 9.77728 2.5 10.3928 2.5C11.0083 2.5 11.3403 3.5173 12.0043 5.55191L12.2949 6.44244C12.4784 7.00479 12.5701 7.28596 12.7928 7.44706C13.0155 7.60816 13.3125 7.60816 13.9063 7.60816H14.8683C17.0355 7.60816 18.119 7.60816 18.3081 8.19335C18.4972 8.77854 17.6169 9.40763 15.8563 10.6658L15.0921 11.2118C14.6069 11.5586 14.3643 11.732 14.278 11.9937C14.1918 12.2554 14.2841 12.5382 14.4687 13.1038L14.7569 13.9872C15.4209 16.0218 15.7529 17.0391 15.2549 17.3993C14.7569 17.7595 13.8878 17.1308 12.1496 15.8733L11.3887 15.323C10.9083 14.9754 10.6681 14.8016 10.3928 14.8016C10.1175 14.8016 9.87731 14.9754 9.39687 15.323L8.63605 15.8733C6.89779 17.1308 6.02866 17.7595 5.5307 17.3993C5.03273 17.0391 5.36471 16.0218 6.02866 13.9872L6.31927 13.0966C6.50278 12.5343 6.59454 12.2531 6.50948 11.9924C6.42441 11.7318 6.18419 11.558 5.70375 11.2104L4.94293 10.6601C3.20467 9.40261 2.33555 8.77389 2.52575 8.19102C2.71596 7.60816 3.79026 7.60816 5.93886 7.60816H6.87929C7.47315 7.60816 7.77008 7.60816 7.99277 7.44706C8.21547 7.28596 8.30723 7.00479 8.49074 6.44244L8.78135 5.55191Z"
                                        stroke="#9CA3AF" strokeWidth="1.6"
                                    />
                                </svg>
                            </p>
                            <ul className="flex items-center max-sm:justify-center max-sm:flex-wrap gap-2.5">
                                <li className="py-3.5 px-7 rounded-full bg-orange-100 font-semibold text-base leading-7 text-gray-700">HTML</li>
                                <li className="py-3.5 px-7 rounded-full bg-green-100 font-semibold text-base leading-7 text-gray-700">CSS</li>
                                <li className="py-3.5 px-7 rounded-full bg-red-100 font-semibold text-base leading-7 text-gray-700">Dart</li>
                                <li className="py-3.5 px-7 rounded-full bg-yellow-100 font-semibold text-base leading-7 text-gray-700">C++</li>
                                <li className="py-3.5 px-7 rounded-full bg-purple-100 font-semibold text-base leading-7 text-gray-700">UI Design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* Notebooks, Topics, Competitions */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">User Data</h2>
                <div className="grid grid-cols-3 gap-4">
                    {/* Notebooks Card */}
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 16h8m-4-6V4m5 16H7a2 2 0 01-2-2V6a2 2 0 012-2h4a2 2 0 012 2v10m-2 4h4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Notebooks</h3>
                            <ul>
                                {userData.notebooks.length > 0 ? (
                                    userData.notebooks.map((notebook, index) => (
                                        <li key={index} className="text-gray-700">{notebook.title}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No notebooks created</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Topics Card */}
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.5 13.5l-5-5m0 0l-5 5m5-5V21"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Topics</h3>
                            <ul>
                                {userData.topics.length > 0 ? (
                                    userData.topics.map((topic, index) => (
                                        <li key={index} className="text-gray-700">{topic.title}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No topics posted</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Competitions Card */}
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8.25V4m0 0a8.978 8.978 0 018.938 7.75M12 4a8.978 8.978 0 00-8.938 7.75M3.062 12.25c.176 1.004.525 1.958 1.038 2.828L12 20.75l7.9-5.672a8.953 8.953 0 001.038-2.828M21.062 12.25a8.978 8.978 0 01-1.038-2.828M5.05 10.25c.176-.98.497-1.91.95-2.756M18.95 10.25a8.978 8.978 0 00-.95-2.756"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Competitions</h3>
                            <ul>
                                {userData.competitions.length > 0 ? (
                                    userData.competitions.map((competition, index) => (
                                        <li key={index} className="text-gray-700">{competition.title}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No competitions participated</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>



            {/* Submission Activity */}
            <div className="w-full bg-white shadow-lg rounded-lg p-6 mx-auto mt-8">
                <div className="flex justify-between items-center mb-4">
                    {/* Submissions Header */}
                    <p className="text-lg font-semibold">17 submissions in the past one year</p>

                    {/* Active Days & Max Streak */}
                    <div className="text-right">
                        <p className="text-gray-600">
                            Total active days: <span className="font-bold">6</span>
                        </p>
                        <p className="text-gray-600">
                            Max streak: <span className="font-bold">2</span>
                        </p>
                    </div>
                </div>

                {/* Submissions Grid */}
                <div className="flex overflow-x-auto py-4">
                    <div className="flex space-x-2">
                        {/* Render each month's grid */}
                        {months.map((month, index) => (
                            <div key={index} className="flex flex-col items-center">
                                {/* Weekly Blocks */}
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                    {/* Render Small Blocks */}
                                    {Array.from({ length: month.days }).map((_, dayIndex) => {
                                        // Determine if this should be a green box
                                        const isActive = activeDays.some(
                                            (active) => active.month === index && active.day === dayIndex + 1
                                        );
                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-2 h-2 rounded-sm ${isActive ? 'bg-green-600' : 'bg-gray-300'
                                                    }`}
                                            ></div>
                                        );
                                    })}
                                </div>
                                {/* Month Label */}
                                <p className="text-xs text-gray-500">{month.name}</p>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CustomComponent;
