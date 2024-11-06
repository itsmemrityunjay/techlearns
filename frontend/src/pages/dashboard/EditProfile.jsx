import React, { useState, useEffect } from 'react';
import { db, storage } from '../../database/Firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../database/AuthContext'; // Assuming you have an Auth context
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { currentUser, userDocId } = useAuth(); // Get userDocId from AuthContext
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [education, setEducation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(''); // Store uploaded image URL
    const [uploadingImage, setUploadingImage] = useState(false); // Track image upload
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser && userDocId) {
                try {
                    const userRef = doc(db, 'users', userDocId); // Use userDocId
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setFirstName(userData.firstName || '');
                        setLastName(userData.lastName || '');
                        setAge(userData.age || '');
                        setAddress(userData.address || '');
                        setEducation(userData.education || '');
                        setPhoneNumber(userData.phoneNumber || '');
                        setProfileImageUrl(userData.profileImage || ''); // Set existing image URL
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    setError('Failed to load profile data.');
                }
            }
        };
        fetchUserData();
    }, [currentUser, userDocId]); // Dependency on userDocId

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadingImage(true); // Start uploading
            try {
                const imageRef = ref(storage, `profileImages/${currentUser.uid}`);
                await uploadBytes(imageRef, file);
                const url = await getDownloadURL(imageRef);
                setProfileImageUrl(url); // Store the URL after upload
                setUploadingImage(false); // Stop uploading
            } catch (err) {
                setError('Failed to upload image.');
                setUploadingImage(false); // Stop uploading on error
                console.error('Error uploading image:', err);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!userDocId) {
            setError('User document ID not found.');
            return;
        }

        try {
            const userRef = doc(db, 'users', userDocId); // Use userDocId to update the document
            await updateDoc(userRef, {
                firstName,
                lastName,
                age,
                address,
                education,
                phoneNumber,
                ...(profileImageUrl && { profileImage: profileImageUrl }), // Include profile image if uploaded
            });

            navigate('/user'); // Redirect after update
        } catch (err) {
            setError('Failed to update profile');
            console.error('Error updating profile:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-8">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleUpdate}>
                    <label className="block mb-4">
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Age:
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Address:
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Education:
                        <input
                            type="text"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Phone Number:
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </label>
                    <label className="block mb-4">
                        Profile Image:
                        <input
                            type="file"
                            onChange={handleImageUpload} // Capture file and upload
                            className="w-full p-2 border rounded-lg"
                        />
                        {uploadingImage && <p className="text-blue-500 mt-2">Uploading image...</p>}
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold"
                        disabled={uploadingImage || !profileImageUrl} // Disable until image is uploaded
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
