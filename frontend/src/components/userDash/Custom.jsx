import React, { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getUserData, updateUserData } from '../../database/Firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, Timestamp, arrayUnion } from "firebase/firestore";
import { db } from "../../database/Firebase";
import { useAuth } from "../../database/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import bronzeBadge from '../../assets/bronze-badge.png';
import silverBadge from '../../assets/silver-badge.png';
import goldBadge from '../../assets/gold-badge.png';

const badgeImages = {
    'bronze': bronzeBadge,
    'silver': silverBadge,
    'gold': goldBadge
};

const CustomComponent = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notebooks, setNotebooks] = useState([]);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        address: '',
        education: '',
        phoneNumber: '',
        bio: '',
        occupation: '',
        skills: []
    });
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        address: '',
        education: '',
        phoneNumber: '',
        email: '',
        bio: '',
        occupation: '',
        skills: [],
        photoURL: '',
        profileImage: '',
        notebooks: [],
        topics: [],
        competitions: []
    });
    const [loginActivity, setLoginActivity] = useState({
        streak: 0,
        maxStreak: 0,
        activeDays: [],
        lastLogin: null
    });

    // Add new state variables for image handling
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Fetch the authenticated user's data
    useEffect(() => {
        const auth = getAuth();
        const storage = getStorage();

        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);
                console.log("Current user:", loggedInUser);
                console.log("User UID:", loggedInUser.uid);

                const fetchedUserData = await getUserData(loggedInUser.uid);
                console.log("Fetched raw user data:", fetchedUserData); // Debug log

                // Get profile image from Firebase Storage if it exists
                let profileImageUrl = fetchedUserData.photoURL ||
                    fetchedUserData.profileImage ||
                    fetchedUserData.profileImageUrl;

                // Convert gs:// URL to a public URL if needed
                if (profileImageUrl && profileImageUrl.startsWith("gs://")) {
                    const storageRef = ref(storage, profileImageUrl.replace("gs://", ""));
                    profileImageUrl = await getDownloadURL(storageRef);
                }

                // Format data according to your database structure
                const userData = {
                    firstName: fetchedUserData.firstName || '',
                    lastName: fetchedUserData.lastName || '',
                    age: fetchedUserData.age || '',
                    address: fetchedUserData.address || '',
                    education: fetchedUserData.education || '',
                    phoneNumber: fetchedUserData.phoneNumber || '',
                    bio: fetchedUserData.bio || "No bio added yet",
                    occupation: fetchedUserData.occupation || "No occupation added yet",
                    skills: fetchedUserData.skills || [],
                    photoURL: profileImageUrl,
                    email: fetchedUserData.email || loggedInUser.email,
                    notebooks: fetchedUserData.notebooks || [],
                    topics: fetchedUserData.topics || [],
                    competitions: fetchedUserData.competitions || [],
                    badges: fetchedUserData.badges || [] // Add this line to include badges
                };

                setUserData(userData);
                setEditFormData(userData);
                console.log("Processed user data:", userData); // Debug log

                // Update login streak
                updateLoginStreak(loggedInUser.uid);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Update login streak
    const updateLoginStreak = async (userId) => {
        try {
            const userActivityRef = doc(db, "userActivity", userId);
            const activitySnap = await getDoc(userActivityRef);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Timestamp.fromDate(today);

            let activityData = {};
            let currentStreak = 0;
            let maxStreak = 0;
            let activeDays = [];

            if (activitySnap.exists()) {
                activityData = activitySnap.data();
                activeDays = activityData.activeDays || [];
                maxStreak = activityData.maxStreak || 0;

                // Check if we already logged in today
                const lastLogin = activityData.lastLogin?.toDate();
                if (lastLogin) {
                    const lastLoginDay = new Date(lastLogin);
                    lastLoginDay.setHours(0, 0, 0, 0);

                    if (lastLoginDay.getTime() === today.getTime()) {
                        // Already logged in today
                        currentStreak = activityData.currentStreak || 0;
                    } else {
                        // Check if this is a consecutive day
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);

                        if (lastLoginDay.getTime() === yesterday.getTime()) {
                            // Consecutive day
                            currentStreak = (activityData.currentStreak || 0) + 1;
                        } else {
                            // Streak broken
                            currentStreak = 1;
                        }

                        // Add today to active days if not already there
                        if (!activeDays.some(day => day.toDate().getTime() === today.getTime())) {
                            activeDays.push(todayTimestamp);
                        }
                    }
                } else {
                    // First login
                    currentStreak = 1;
                    activeDays.push(todayTimestamp);
                }
            } else {
                // First login ever
                currentStreak = 1;
                activeDays = [todayTimestamp];
            }

            // Update max streak if needed
            maxStreak = Math.max(currentStreak, maxStreak);

            // Update activity data
            await setDoc(userActivityRef, {
                lastLogin: todayTimestamp,
                currentStreak,
                maxStreak,
                activeDays
            }, { merge: true });

            setLoginActivity({
                streak: currentStreak,
                maxStreak,
                activeDays: activeDays.map(day => day.toDate()),
                lastLogin: todayTimestamp.toDate()
            });

        } catch (error) {
            console.error("Error updating login streak:", error);
        }
    };

    // Fetch notebooks
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
    }, [userData.email]);

    // Generate activity calendar data
    const generateCalendarData = () => {
        const months = [
            { name: 'Jan', days: 31 },
            { name: 'Feb', days: 28 },
            { name: 'Mar', days: 31 },
            { name: 'Apr', days: 30 },
            { name: 'May', days: 31 },
            { name: 'Jun', days: 30 },
            { name: 'Jul', days: 31 },
            { name: 'Aug', days: 31 },
            { name: 'Sep', days: 30 },
            { name: 'Oct', days: 31 },
            { name: 'Nov', days: 30 },
            { name: 'Dec', days: 31 },
        ];

        // Check which days are active
        const isActive = (month, day) => {
            return loginActivity.activeDays.some(date => {
                return date.getMonth() === month && date.getDate() === day;
            });
        };

        return months.map((month, monthIndex) => (
            <div key={monthIndex} className="flex flex-col items-center">
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {Array.from({ length: month.days }).map((_, dayIndex) => (
                        <div
                            key={dayIndex}
                            className={`w-3 h-3 rounded-sm ${isActive(monthIndex, dayIndex + 1)
                                ? 'bg-gradient-to-r from-green-400 to-green-600'
                                : 'bg-gray-200'
                                } hover:transform hover:scale-150 transition-all duration-200 cursor-pointer`}
                            title={`${month.name} ${dayIndex + 1}`}
                        ></div>
                    ))}
                </div>
                <p className="text-xs text-gray-500">{month.name}</p>
            </div>
        ));
    };

    // Courses functionality
    const [courses, setCourses] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const { currentUser, userDocId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setCourses(coursesData);

                // Fetch user progress for these courses
                if (currentUser) {
                    coursesData.forEach((course) => fetchUserProgress(course.id));
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        const fetchUserProgress = async (courseId) => {
            try {
                const progressRef = doc(db, "userProgress", `${currentUser.uid}_${courseId}`);
                const progressSnap = await getDoc(progressRef);

                setUserProgress((prev) => ({
                    ...prev,
                    [courseId]: progressSnap.exists() ? progressSnap.data() : null,
                }));
            } catch (error) {
                console.error("Error fetching progress:", error);
            }
        };

        fetchCourses();
    }, [currentUser]);

    const handleCompleteCourse = async (courseId, courseTitle) => {
        try {
            // Track course progress directly in the user document
            const userRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                // Generate certificate if needed
                const certificateURL = await generateCertificate(courseTitle);

                // Add course to completed courses in user document 
                await updateDoc(userRef, {
                    completedCourses: arrayUnion({
                        courseId,
                        title: courseTitle,
                        completedAt: new Date(),
                        certificateURL
                    })
                });

                toast.success("Congratulations! You've completed this course.");

                // Update local state
                setUserProgress((prev) => ({
                    ...prev,
                    [courseId]: {
                        completed: true,
                        completedAt: new Date(),
                        certificateURL,
                    },
                }));
            } else {
                toast.error("User document not found");
            }
        } catch (error) {
            console.error("Error completing course:", error);
            toast.error("Something went wrong while marking completion!");
        }
    };

    const generateCertificate = async (courseTitle) => {
        return `https://dummy-certificate.com/certificate/${courseTitle}-${Date.now()}.pdf`;
    };

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // Handle skills changes
    const handleSkillChange = (index, value) => {
        const updatedSkills = [...editFormData.skills];
        updatedSkills[index] = value;
        setEditFormData({
            ...editFormData,
            skills: updatedSkills
        });
    };

    // Add new skill
    const addSkill = () => {
        setEditFormData({
            ...editFormData,
            skills: [...editFormData.skills, '']
        });
    };

    // Remove skill
    const removeSkill = (index) => {
        const updatedSkills = editFormData.skills.filter((_, i) => i !== index);
        setEditFormData({
            ...editFormData,
            skills: updatedSkills
        });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!currentUser?.uid) {
                toast.error("User identification not available");
                return;
            }

            // Always use currentUser.uid directly - remove the userDocId reference
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            // Create base data object without potentially undefined fields
            const updatedUserData = {
                firstName: editFormData.firstName || '',
                lastName: editFormData.lastName || '',
                age: editFormData.age || '',
                address: editFormData.address || '',
                education: editFormData.education || '',
                phoneNumber: editFormData.phoneNumber || '',
                bio: editFormData.bio || '',
                occupation: editFormData.occupation || '',
                skills: editFormData.skills || [],
                email: currentUser.email,
                updatedAt: new Date()
            };

            // Only add photoURL if it exists
            if (user?.photoURL || userData.photoURL) {
                updatedUserData.photoURL = user?.photoURL || userData.photoURL;
            }

            // Don't include profileImage field at all if it's undefined
            if (userData.profileImage) {
                updatedUserData.profileImage = userData.profileImage;
            }

            console.log("Saving data to Firestore:", updatedUserData);

            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, updatedUserData);
            } else {
                await setDoc(userDocRef, {
                    ...updatedUserData,
                    createdAt: new Date()
                });
            }

            // Update local state
            setUserData({
                ...userData,
                ...updatedUserData
            });

            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    // Handler for opening the image modal
    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setShowModal(true);
    };

    // Handler for file input change (when a new image is selected)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.includes('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Check file size (limit to 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        try {
            setUploading(true);
            const storage = getStorage();

            // Create a reference to the new file location
            const fileRef = ref(storage, `profile_images/${currentUser.uid}/${Date.now()}_${file.name}`);

            // Upload the file
            await uploadBytes(fileRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(fileRef);

            // Delete the old profile image if it exists and is not a default image
            if (user?.photoURL && !user.photoURL.includes('pixabay') && !user.photoURL.includes('placeholder')) {
                try {
                    // Extract the old file path from the URL
                    const oldFileRef = ref(storage, user.photoURL);
                    await deleteObject(oldFileRef);
                } catch (error) {
                    console.error("Error deleting old profile image:", error);
                }
            }

            // Update auth profile
            const auth = getAuth();
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });

            // Update Firestore document
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                photoURL: downloadURL,
                updatedAt: new Date()
            });

            // Update local state
            setUser({ ...user, photoURL: downloadURL });
            toast.success("Profile image updated successfully!");
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast.error("Failed to update profile image");
        } finally {
            setUploading(false);
        }
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container mx-auto py-8 ">
            {/* Hidden file input for image upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Image Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-4xl max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full p-2 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setShowModal(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <img
                                src={modalImage}
                                alt="Enlarged view"
                                className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative pt-40 pb-12 mb-8"
            >
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                </div>

                <div className="w-full container bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-auto p-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Profile Image - Updated with click handlers */}
                        <div className="relative">
                            <img
                                src={user?.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                alt="Profile"
                                className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleImageClick(user?.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")}
                            />
                            {isEditing && (
                                <button
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all"
                                    onClick={triggerFileInput}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="h-4 w-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {!isEditing ? (
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {userData.firstName || "New"} {userData.lastName || "User"}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{userData.email}</p>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                                            {userData.age && `Age: ${userData.age}`}
                                            {userData.education && ` | Education: ${userData.education}`}
                                        </p>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">{userData.bio}</p>
                                        {userData.address && (
                                            <p className="text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Address:</span> {userData.address}
                                            </p>
                                        )}
                                        {userData.phoneNumber && (
                                            <p className="text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Phone:</span> {userData.phoneNumber}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editFormData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="First Name"
                                                className="w-full text-2xl font-bold border-b-2 border-blue-300 focus:border-blue-500 bg-transparent outline-none"
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editFormData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Last Name"
                                                className="w-full text-2xl font-bold border-b-2 border-blue-300 focus:border-blue-500 bg-transparent outline-none"
                                            />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">{userData.email} (cannot be changed)</p>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <input
                                                type="text"
                                                name="age"
                                                value={editFormData.age}
                                                onChange={handleInputChange}
                                                placeholder="Age"
                                                className="border rounded-md p-2 bg-white dark:bg-gray-700"
                                            />
                                            <input
                                                type="text"
                                                name="education"
                                                value={editFormData.education}
                                                onChange={handleInputChange}
                                                placeholder="Education"
                                                className="border rounded-md p-2 bg-white dark:bg-gray-700"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={editFormData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            className="w-full mt-2 border rounded-md p-2 bg-white dark:bg-gray-700"
                                        />

                                        <textarea
                                            name="address"
                                            value={editFormData.address}
                                            onChange={handleInputChange}
                                            placeholder="Address"
                                            className="w-full mt-2 border rounded-md p-2 bg-white dark:bg-gray-700"
                                        />

                                        <textarea
                                            name="bio"
                                            value={editFormData.bio}
                                            onChange={handleInputChange}
                                            className="w-full mt-2 border rounded-md p-2 bg-white dark:bg-gray-700"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                )}

                                <div className="flex items-center">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleFormSubmit}
                                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Day Streak - outside of the flex container */}
                            <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium text-green-800 dark:text-green-200">
                                    {loginActivity.streak} Day Streak
                                </span>
                            </div>

                            {/* Skills */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.78135 5.55191C9.4453 3.5173 9.77728 2.5 10.3928 2.5C11.0083 2.5 11.3403 3.5173 12.0043 5.55191L12.2949 6.44244C12.4784 7.00479 12.5701 7.28596 12.7928 7.44706C13.0155 7.60816 13.3125 7.60816 13.9063 7.60816H14.8683C17.0355 7.60816 18.119 7.60816 18.3081 8.19335C18.4972 8.77854 17.6169 9.40763 15.8563 10.6658L15.0921 11.2118C14.6069 11.5586 14.3643 11.732 14.278 11.9937C14.1918 12.2554 14.2841 12.5382 14.4687 13.1038L14.7569 13.9872C15.4209 16.0218 15.7529 17.0391 15.2549 17.3993C14.7569 17.7595 13.8878 17.1308 12.1496 15.8733L11.3887 15.323C10.9083 14.9754 10.6681 14.8016 10.3928 14.8016C10.1175 14.8016 9.87731 14.9754 9.39687 15.323L8.63605 15.8733C6.89779 17.1308 6.02866 17.7595 5.5307 17.3993C5.03273 17.0391 5.36471 16.0218 6.02866 13.9872L6.31927 13.0966C6.50278 12.5343 6.59454 12.2531 6.50948 11.9924C6.42441 11.7318 6.18419 11.558 5.70375 11.2104L4.94293 10.6601C3.20467 9.40261 2.33555 8.77389 2.52575 8.19102C2.71596 7.60816 3.79026 7.60816 5.93886 7.60816H6.87929C7.47315 7.60816 7.77008 7.60816 7.99277 7.44706C8.21547 7.28596 8.30723 7.00479 8.49074 6.44244L8.78135 5.55191Z"
                                            stroke="#6B7280" strokeWidth="1.6"
                                        />
                                    </svg>
                                    Skills
                                </h3>

                                {!isEditing ? (
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skills && userData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="py-1.5 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 dark:from-indigo-900 dark:to-blue-900 dark:text-indigo-200 shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {editFormData.skills.map((skill, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                                    className="border rounded-md px-3 py-1.5 flex-1 bg-white dark:bg-gray-700"
                                                />
                                                <button
                                                    onClick={() => removeSkill(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addSkill}
                                            className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Add Skill
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* User Data Cards */}
            <div className="my-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Notebooks Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
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
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Notebooks</h3>
                        </div>
                        <div className="max-h-40 overflow-y-auto pr-2">
                            {userData.notebooks.length > 0 ? (
                                <ul className="space-y-2">
                                    {userData.notebooks.map((notebook, index) => (
                                        <li
                                            key={index}
                                            className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-gray-700 dark:text-yellow-100 flex justify-between items-center"
                                        >
                                            <span>{notebook.title}</span>
                                            <Link to={`/notebook/${notebook.id}`} className="text-blue-500 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No notebooks created yet.
                                    <Link to="/notebook" className="block mt-2 text-blue-500 hover:text-blue-600">Create one?</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Topics Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
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
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Topics</h3>
                        </div>
                        <div className="max-h-40 overflow-y-auto pr-2">
                            {userData.topics.length > 0 ? (
                                <ul className="space-y-2">
                                    {userData.topics.map((topic, index) => (
                                        <li
                                            key={index}
                                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-blue-100 flex justify-between items-center"
                                        >
                                            <span>{topic.title}</span>
                                            <Link to={`/discussion/${topic.id}`} className="text-blue-500 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No topics posted yet.
                                    <Link to="/discussForm" className="block mt-2 text-blue-500 hover:text-blue-600">Start a discussion?</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Competitions Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
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
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Competitions</h3>
                        </div>
                        <div className="max-h-40 overflow-y-auto pr-2">
                            {userData.competitions.length > 0 ? (
                                <ul className="space-y-2">
                                    {userData.competitions.map((competition, index) => (
                                        <li
                                            key={index}
                                            className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-gray-700 dark:text-pink-100 flex justify-between items-center"
                                        >
                                            <span>{competition.title}</span>
                                            <Link to={`/competition/${competition.id}`} className="text-blue-500 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No competitions participated in yet.
                                    <Link to="/competition" className="block mt-2 text-blue-500 hover:text-blue-600">Join a competition?</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Login Activity / Submissions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 my-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Login Activity
                    </h2>
                    <div className="text-right">
                        <p className="text-gray-700 dark:text-gray-300">
                            Current Streak: <span className="font-bold text-green-600 dark:text-green-400">{loginActivity.streak} days</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Longest Streak: <span className="font-bold text-blue-600 dark:text-blue-400">{loginActivity.maxStreak} days</span>
                        </p>
                    </div>
                </div>

                {/* Calendar Visualization */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner overflow-x-auto">
                    <div className="flex space-x-2">
                        {generateCalendarData()}
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Login each day to build your streak and track your progress!
                </div>
            </motion.div>

            {/* My Courses */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 my-8"
            >
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Learning Journey
                </h2>

                {courses.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">No courses found in your learning journey.</p>
                        <Link to="/course" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const progress = userProgress[course.id];

                            return (
                                <div
                                    key={course.id}
                                    className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102"
                                >
                                    <div className="relative cursor-pointer" onClick={() => handleImageClick(course.thumbnailURL || "https://via.placeholder.com/300x200?text=Course+Video")}>
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={course.thumbnailURL || "https://via.placeholder.com/300x200?text=Course+Video"}
                                            alt={course.title}
                                        />
                                        {progress?.completed && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                COMPLETED
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{course.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>

                                        {progress?.completed ? (
                                            <div className="space-y-3">
                                                <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                                                    Completed on {new Date(progress.completedAt?.toDate?.() || progress.completedAt).toLocaleDateString()}
                                                </p>
                                                <a
                                                    href={progress.certificateURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-center py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Download Certificate
                                                    </span>
                                                </a>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCompleteCourse(course.id, course.title)}
                                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Mark as Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* My Badges */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 my-8"
            >
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    My Achievement Badges
                </h2>

                {!userData.badges || userData.badges.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">You haven't earned any badges yet.</p>
                        <Link to="/course" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Take Courses to Earn Badges
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userData.badges.map((badge, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl p-4 flex flex-col items-center"
                            >
                                <div className="relative w-24 h-24 mb-4">
                                    <img
                                        src={badgeImages[badge.badgeType] || `https://via.placeholder.com/100?text=${badge.badgeType}`}
                                        alt={`${badge.badgeType} Badge`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <h3 className="font-bold text-lg mb-1 text-center text-gray-800 dark:text-white">
                                    {badge.badgeType.charAt(0).toUpperCase() + badge.badgeType.slice(1)} Badge
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 text-center">
                                    {badge.courseName}
                                </p>

                                <div className="mt-2 flex items-center gap-1">
                                    <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${Math.min(100, badge.score)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {Math.round(badge.score)}%
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                    Earned on {badge.earnedAt?.toDate ? badge.earnedAt.toDate().toLocaleDateString() : new Date(badge.earnedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CustomComponent;