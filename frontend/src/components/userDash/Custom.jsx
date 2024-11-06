import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { getUserData } from '../../database/Firebase';  // Import the getUserData function

const CustomComponent = () => {
    const [user, setUser] = useState(null);  // Store user info
    const [userData, setUserData] = useState({
        notebooks: [],
        topics: [],
        competitions: [],
    });  // Store user's notebooks, topics, competitions

    // Fetch the authenticated user's data
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);
                const fetchedUserData = await getUserData(loggedInUser.uid);  // Fetch additional user data from Firestore
                setUserData({
                    notebooks: fetchedUserData.notebooks || [],
                    topics: fetchedUserData.topics || [],
                    competitions: fetchedUserData.competitions || [],
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();  // Clean up the subscription on component unmount
    }, []);

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
            <div className="flex items-start justify-between gap-5">
                {/* Profile Section */}
                <div className="grid grid-cols-2 gap-4 h-auto items-center justify-center w-3/5 bg-white shadow-2xl rounded-lg p-8 ">
                    {/* Circular Avatar on top */}
                    <div aria-hidden="true" className=" w-4/5 p-5  justify-center flex items-center">
                        <img
                            src="https://picsum.photos/200"
                            alt="Avatar"
                            className="w-full h-auto rounded-full object-cover "
                        />
                    </div>

                    {/* Details below */}
                    <div className="text-start w-full">
                        {user ? (
                            <>
                                <h1 className="text-xl font-bold mb-3">{user.displayName || user.email}</h1>
                                <p className="text-gray-600 mb-2">Rank: 12,33,543</p>
                                <p className="text-gray-600 mb-2">Solutions: 0</p>
                                <p className="text-gray-600 mb-4">Discuss: 0</p>
                            </>
                        ) : (
                            <p className="text-gray-600 mb-4">User not logged in</p>
                        )}

                        {/* Full-width Edit Profile Button */}
                        <button className="bg-blue-950 text-white w-full px-4 py-2 rounded-md shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-200">
                            <Link to="/edit-profile">
                                Edit Profile
                            </Link>
                        </button>
                    </div>
                </div>

                {/* Side Cards Container */}
                <div className="flex flex-col space-y-4 h-full w-2/5">
                    {/* Badge Card */}
                    <div className="bg-white shadow-xl rounded-lg p-4">
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">Badges</p>
                            <p className="text-2xl font-bold mb-4">0</p>

                            {/* Locked Badge */}
                            <div className="flex flex-col items-center bg-gray-200 p-3 rounded-md shadow">
                                <p className="text-gray-600 text-sm">Locked Badge</p>
                                <p className="text-gray-700 font-medium">Oct LeetCoding Challenge</p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Card */}
                    <div className="bg-white shadow-xl rounded-lg p-4 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full">
                            {/* Circular Progress Placeholder */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-20 h-20 rounded-full border-4 border-gray-300">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-3xl font-bold text-gray-800">7</p>
                                        <p className="text-sm text-gray-600">/ 3323</p>
                                    </div>
                                </div>
                                <p className="text-green-600 font-semibold mt-2">Solved</p>
                                <p className="text-gray-500 text-sm">0 Attempting</p>
                            </div>

                            {/* Difficulty Levels */}
                            <div className="flex flex-col space-y-2 ml-4">
                                <div className="bg-gray-100 px-3 py-1 rounded shadow-sm text-center w-20">
                                    <p className="text-teal-500 font-bold">Easy</p>
                                    <p className="text-sm text-gray-800">3/830</p>
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded shadow-sm text-center w-20">
                                    <p className="text-yellow-600 font-bold">Med.</p>
                                    <p className="text-sm text-gray-800">4/1738</p>
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded shadow-sm text-center w-20">
                                    <p className="text-red-600 font-bold">Hard</p>
                                    <p className="text-sm text-gray-800">0/755</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notebooks, Topics, Competitions */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">User Data</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
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
                    <div className="bg-white p-4 rounded-lg shadow-lg">
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
                    <div className="bg-white p-4 rounded-lg shadow-lg">
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
        </div>
    );
};

export default CustomComponent;
