// src/App.js
import React, { useState } from 'react';
import CompHero from "../../assets/CompHero.svg";
import { db, storage } from '../../database/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAuth } from '../../database/AuthContext';

const Competitions = () => {
    const [showModal, setShowModal] = useState(false);
    const [iconFile, setIconFile] = useState(null);
    const [iconURL, setIconURL] = useState('');
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        icon: '', // Will be set to iconURL after upload
        type: '',
        title: '',
        subtitle: '',
        privacy: 'public', // Default to public
        visibility: 'everyone', // Default to everyone
        whoCanJoin: 'everyone', // Default to everyone
        terms: '',
        eligibility: '',
        prizePool: '',
        enableNotebook: false,
        evaluationCriteria: '',
        fileSubmission: false,
        file: null,
        startDate: '', // New field for start date
        startTime: '', // New field for start time
        endDate: '', // New field for end date
        endTime: '', // New field for end time
        author: currentUser.email,
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle icon upload
    const handleIconUpload = async (file) => {
        if (!file) {
            alert('Please select an icon file to upload.');
            return;
        }

        try {
            const storageRef = ref(storage, `competition-icons/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // You can implement progress updates here if desired
                },
                (error) => {
                    console.error('Error uploading icon:', error);
                    alert('Failed to upload icon.');
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setIconURL(downloadURL);
                    setFormData((prevData) => ({
                        ...prevData,
                        icon: downloadURL,
                    }));
                    alert('Icon successfully uploaded!');
                }
            );
        } catch (error) {
            console.error('Error in handleIconUpload:', error);
            alert('Failed to upload icon.');
        }
    };

    // Handle file change for submissions
    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    // Handle competition submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            let fileURL = '';
            // If file submission is enabled and a file is selected, upload the file
            if (formData.fileSubmission && formData.file) {
                const file = formData.file;
                const fileStorageRef = ref(storage, `competition-files/${file.name}`);
                const uploadTask = uploadBytesResumable(fileStorageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            // You can implement progress updates here if desired
                        },
                        (error) => {
                            console.error('Error uploading file:', error);
                            reject(error);
                        },
                        async () => {
                            fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });

                // Update formData with the fileURL
                setFormData((prevData) => ({
                    ...prevData,
                    file: fileURL,
                }));
            }

            // Add competition to Firestore
            await addDoc(collection(db, 'competitions'), {
                ...formData,
                status: 'pending', // Set as pending for admin approval
                createdAt: new Date(),
            });

            setSuccessMessage('Competition submitted for approval.');
            setShowModal(false); // Close modal after submission
            setFormData({ // Reset form data
                icon: '',
                type: '',
                title: '',
                subtitle: '',
                privacy: 'public',
                visibility: 'everyone',
                whoCanJoin: 'everyone',
                terms: '',
                eligibility: '',
                prizePool: '',
                enableNotebook: false,
                evaluationCriteria: '',
                fileSubmission: false,
                file: null,
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
            });
            setIconURL('');
        } catch (error) {
            console.error('Error submitting competition:', error);
            setErrorMessage('Error submitting competition: ' + error.message);
        }
    };

    return (
        <div className='container mx-auto py-8'>
            <div className="flex justify-center items-center">
                {/* Main Container */}
                <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-8xl bg-white shadow-lg p-6 rounded-lg">
                    {/* Left Section */}
                    <div className="flex-1 mb-6 md:mb-0 mt-14">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 ml-6">Competitions</h1>
                        <p className="text-gray-600 mb-6 ml-6">
                            Grow your data science skills by competing in our exciting <br /> competitions. Find help in the{' '}
                            <a
                                className="text-black-600 underline"
                                href="/docs/competitions"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                documentation
                            </a>{' '}
                            or learn about{' '}
                            <br />
                            <a
                                className="text-black-600 underline"
                                href="/c/about/community"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Community Competitions
                            </a>.
                        </p>
                        {/* Button to trigger modal */}
                        <div className="flex space-x-4 ml-6">
                            <button
                                className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                                onClick={() => setShowModal(true)}
                            >
                                Host a Competition
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Image */}
                    <div className="flex-shrink-0 mr-6">
                        <img
                            src={CompHero}
                            alt="Competitions"
                            width="280"
                            height="208"
                            className="w-72 h-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Modal for hosting competition */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto h-[80vh]">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Host a Competition</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Competition Image */}
                            <div className="mb-4">
                                <label className="block mb-2 font-bold">Competition Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setIconFile(e.target.files[0])}
                                    className="border rounded p-2 w-full"
                                />
                                <button
                                    type="button"
                                    className="secondary-bg text-white px-4 py-2 rounded mt-2"
                                    onClick={() => handleIconUpload(iconFile)}
                                >
                                    Upload Icon
                                </button>
                            </div>

                            {/* Competition Type */}
                            <div>
                                <label className="block text-gray-700">Competition Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select Competition Type</option>
                                    <option value="data-science">Data Science</option>
                                    <option value="ai">AI</option>
                                    <option value="machine-learning">Machine Learning</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            {/* Privacy Access */}
                            <div>
                                <label className="block text-gray-700">Privacy Access</label>
                                <select
                                    name="privacy"
                                    value={formData.privacy}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            {/* Who Can Join */}
                            <div>
                                <label className="block text-gray-700">Who Can Join</label>
                                <select
                                    name="whoCanJoin"
                                    value={formData.whoCanJoin}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="invitation-only">Invitation Only</option>
                                </select>
                            </div>

                            {/* Eligibility Criteria */}
                            <div>
                                <label className="block text-gray-700">Eligibility Criteria</label>
                                <textarea
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Describe who is eligible to participate."
                                ></textarea>
                            </div>

                            {/* Prize Pool */}
                            <div>
                                <label className="block text-gray-700">Prize Pool</label>
                                <input
                                    type="text"
                                    name="prizePool"
                                    value={formData.prizePool}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Enter prize pool details."
                                />
                            </div>

                            {/* Enable Notebook */}
                            <div>
                                <label className="block text-gray-700">Enable Notebook</label>
                                <input
                                    type="checkbox"
                                    name="enableNotebook"
                                    checked={formData.enableNotebook}
                                    onChange={handleChange}
                                    className="mr-2"
                                /> Enable notebook feature
                            </div>

                            {/* Evaluation Criteria */}
                            <div>
                                <label className="block text-gray-700">Evaluation Criteria</label>
                                <textarea
                                    name="evaluationCriteria"
                                    value={formData.evaluationCriteria}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Describe how submissions will be evaluated."
                                ></textarea>
                            </div>

                            {/* File Submission */}
                            <div>
                                <label className="block text-gray-700">File Submission</label>
                                <input
                                    type="checkbox"
                                    name="fileSubmission"
                                    checked={formData.fileSubmission}
                                    onChange={handleChange}
                                    className="mr-2"
                                /> Allow file submissions
                            </div>

                            {/* File Upload */}
                            {formData.fileSubmission && (
                                <div>
                                    <label className="block text-gray-700">Upload File</label>
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            )}

                            {/* Start Date */}
                            <div>
                                <label className="block text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-gray-700">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            {/* Success and Error Messages */}
                            {successMessage && <p className="text-green-600">{successMessage}</p>}
                            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

                            {/* Form Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Display Success or Error Messages Outside Modal if Needed */}
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default Competitions;
