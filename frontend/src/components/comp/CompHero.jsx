// src/App.js
import React, { useState } from 'react';
import CompHero from "../../assets/CompHero.svg";
import { db, storage } from '../../database/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import heroimg from "../../components/comp/mainhero.jpg";
import { useAuth } from '../../database/AuthContext';
import form1 from "../comp/form1.jpg";
import { useNavigate } from 'react-router-dom';
import {
    toast
    , ToastContainer
} from 'react-toastify';


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
        author: currentUser ? currentUser.email : '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // navigate
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/host');
    }

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
            // alert('Please select an icon file to upload.');
            toast.error('Please select an icon file to upload.');
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
                    // alert('Failed to upload icon.');
                    toast.error('Failed to upload icon.');
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setIconURL(downloadURL);
                    setFormData((prevData) => ({
                        ...prevData,
                        icon: downloadURL,
                    }));
                    // alert('Icon successfully uploaded!');
                    toast.success('Icon successfully uploaded!');
                }
            );
        } catch (error) {
            console.error('Error in handleIconUpload:', error);
            // alert('Failed to upload icon.');
            toast.error('Failed to upload icon.');
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
        <div className='container mx-auto py-8 ' >
            {/* <div className="flex justify-center items-center"> */}
            {/* Main Container */}
            {/* <div className="border flex flex-col md:flex-row items-start justify-between w-full max-w-8xl p-6 rounded-lg bg-gradient-to-r from-purple-100 via-purple-50 to-blue-100"> */}
            <div
                className="w-full mt-5 flex flex-col md:flex-row items-start justify-between max-w-8xl p-6 rounded-xl"
                style={{
                    backgroundImage: window.innerWidth >= 768 ? `url(${heroimg})` : "none", // Use image for md screens and above
                    backgroundColor: window.innerWidth < 768 ? "#cf9dd1" : "transparent", // Fallback color for small screens
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "450px",
                    width: "100%",
                }}
            >

                {/* Left Section */}
                <div className="flex-1 mb-6 md:mb-0 mt-14 ml-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4 ml-6 mt-8">Competitions</h1>
                    <p className="text-gray-600 mb-6 ml-6 mt-4" style={{ fontSize: "16px" }}>
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
                            className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-4 rounded-full transition duration-200 w-50 h-12"
                            onClick={handleNavigate}
                        >
                            Host a Competition
                        </button>
                    </div>
                    {/* </div> */}

                    {/* Right Section - Image */}
                    {/* <div className="flex-shrink-0 mr-6">
                        <img
                            src={CompHero}
                            altt="Competitions"
                            width="280"
                            height="208"
                            className="w-72 h-auto"
                        />
                    </div> */}
                </div>

            </div>


            {/* Modal for hosting competition */}

            {/* Modal for hosting competition */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-1/2 shadow-lg w-full max-w-6xl relative overflow-y-auto h-[80vh]" style={{ borderRadius: "20px" }}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 ml-24" style={{ fontFamily: "roboto" }}>Host a Competition</h2>
                        <div className="flex">
                            <form onSubmit={handleSubmit} className="space-y-4  w-1/2 ml-24 overflow-y-scroll">

                                {/* Competition Image */}
                                <div className="mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Competition Image</label>
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setIconFile(e.target.files[0])}
                                            className="hidden "
                                            id="competitionImage"
                                        />
                                        <label
                                            htmlFor="competitionImage"
                                            className="cursor-pointer bg-[--secondary-color] text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                                        >
                                            Choose File
                                        </label>
                                        <button
                                            type="button"
                                            className="ml-4 bg-[--secondary-color] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                                            onClick={() => handleIconUpload(iconFile)}
                                        >
                                            Upload Icon
                                        </button>
                                    </div>
                                </div>

                                {/* Competition Type */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Competition Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    >
                                        <option value="">Select Competition Type</option>
                                        <option value="featured">Featured</option>
                                        <option value="Getting Started">Getting Started</option>
                                        <option value="Research">Research</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="ai">AI</option>
                                        <option value="machine-learning">Machine Learning</option>
                                        <option value="simulation">Simulation</option>
                                        <option value="analyatics">Analyatics</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Subtitle</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                    />
                                </div>

                                {/* Privacy Access */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Privacy Access</label>
                                    <select
                                        name="privacy"
                                        value={formData.privacy}
                                        onChange={handleChange}
                                        className="p-3border border-purple-400 rounded-xl w-3/4"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                {/* Who Can Join */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Who Can Join</label>
                                    <select
                                        name="whoCanJoin"
                                        value={formData.whoCanJoin}
                                        onChange={handleChange}
                                        className=" p-3 border border-purple-400 rounded-xl w-3/4"
                                    >
                                        <option value="everyone">Everyone</option>
                                        <option value="invitation-only">Invitation Only</option>
                                    </select>
                                </div>

                                {/* Eligibility Criteria */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Eligibility Criteria</label>
                                    <textarea
                                        name="eligibility"
                                        value={formData.eligibility}
                                        onChange={handleChange}
                                        className=" p-3 border border-purple-400 rounded-xl w-3/4"
                                        placeholder="Describe who is eligible to participate."
                                    ></textarea>
                                </div>

                                {/* Prize Pool */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Prize Pool</label>
                                    <input
                                        type="text"
                                        name="prizePool"
                                        value={formData.prizePool}
                                        onChange={handleChange}
                                        className=" p-3 border border-purple-400 rounded-xl w-3/4"
                                        placeholder="Enter prize pool details."
                                    />
                                </div>

                                {/* Enable Notebook */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Enable Notebook</label>
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
                                    <label className="block text-gray-700 font-semibold">Evaluation Criteria</label>
                                    <textarea
                                        name="evaluationCriteria"
                                        value={formData.evaluationCriteria}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        placeholder="Describe how submissions will be evaluated."
                                    ></textarea>
                                </div>

                                {/* File Submission */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">File Submission</label>
                                    <input
                                        type="checkbox"
                                        name="fileSubmission"
                                        checked={formData.fileSubmission}
                                        onChange={handleChange}
                                        className="mr-2"
                                    /> Allow file submissions
                                </div>

                                {/* File Upload */}
                                {/* {formData.fileSubmission && (
                    <div>
                        <label className="block text-gray-700 font-semibold">Upload File</label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="w-full p-3 border-0 rounded-lg shadow-lg focus:ring-0 hover:shadow-2xl transition duration-200"
                        />
                    </div>
                )} */}

                                {/* Start Date */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    />
                                </div>

                                {/* Start Time */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    />
                                </div>

                                {/* End Time */}
                                <div>
                                    <label className="block text-gray-700 font-semibold">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="p-3 border border-purple-400 rounded-xl w-3/4"
                                        required
                                    />
                                </div>

                                {/* Success and Error Messages */}
                                {successMessage && <p className="text-green-600">{successMessage}</p>}
                                {errorMessage && <p className="text-red-600">{errorMessage}</p>}

                                {/* Form Buttons */}
                                <div className="flex justify-end space-x-4 mr-32">
                                    <button
                                        type="button"
                                        className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 flex items-center justify-center w-32 h-12 rounded-full"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[--secondary-color] hover:bg-[--primary-color] text-white px-4 py-2 shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center w-32 h-12 rounded-full"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <div className='mt-[-30px] w-1/2 overflow-y-auto'>
                                <img className='w-11/12 rounded-lg' src={form1} alt="" />
                            </div>
                        </div>
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
