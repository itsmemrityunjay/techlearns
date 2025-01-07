import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css'; // Quill styles
import CompHero from "../../assets/CompHero.svg";
import { db } from '../../database/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import discuss from "../comp/discuss.jpg";
const DiscussHero = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '', // For rich text editor content
        tags: '',
        type: '',
    });
    const [authorName, setAuthorName] = useState('Anonymous');
    const [authorImage, setAuthorImage] = useState(''); // Store the author's profile image
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch the current user's display name and photo URL (author image)
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setAuthorName(user.email || 'Anonymous');
            setAuthorImage(user.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'); // Use a default if no image is provided
        } else {
            setAuthorName('Anonymous');
            setAuthorImage('defaultAvatarUrl'); // Use a default if no user is logged in
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleContentChange = (content) => {
        setFormData({ ...formData, content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Add topic to Firestore with author's name and image
            await addDoc(collection(db, 'topics'), {
                ...formData,
                author: authorName,
                authorImage: authorImage, // Save the author's profile image
                createdAt: new Date(),
            });
            setSuccessMessage('Topic published successfully.');
            setShowModal(false); // Close modal after submission
            setFormData({
                type: '',
                title: '',
                content: '',
                tags: '',
            });
            toast.success('Topic published successfully!');
        } catch (error) {
            setErrorMessage('Error submitting topic: ' + error.message);
            toast.error('Error submitting topic!');
        }
    };

    return (
        <div className='container mx-auto py-8'>
              {/* hero section */}
              <div className='mt-12' style={{
                                backgroundImage:`url(${discuss})`,
                                backgroundSize: "contain", // Ensures the whole image is visible
                                backgroundRepeat: "no-repeat", // Prevents tiling of the image
                                backgroundPosition: "center",
                                height: "450px",
                                width:'100%',
                                                    
                            }}>
                           
           
                        <h1 className="text-5xl font-bold text-gray-800 mb-4 ml-24 mt-8">Join the Discussion!</h1>
                        <p className="text-gray-600 mb-6 lg:ml-24 sm:w-full sm:mr-8 lg:w-1/2 mt-48">
                            Discuss the Kaggle platform & machine learning topics – this includes sharing feedback, asking questions, and more.{' '}
                            <a className="text-black-600 underline" href="/docs/competitions" target="_blank" rel="noopener noreferrer">
                                documentation
                            </a> or learn about{' '}
                            <a className="text-black-600 underline" href="/c/about/community" target="_blank" rel="noopener noreferrer">
                                Community Competitions
                            </a>.
                        </p>
                        <div className="flex space-x-4 lg:ml-24">
                            <button
                                className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                                onClick={() => setShowModal(true)}
                            >
                                New Topic
                            </button>   
                            </div>        
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto h-[80vh]">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">New Topic</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Topic Category</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full secondary-text p-2 border border-gray-300 rounded"
                                >
                                    <option value="general">General Discussion</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="question">Question</option>
                                </select>

                                <label className="block text-gray-700">Topic Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className='h-[45vh]'>
                                <label className="block text-gray-700">Share Your Thoughts</label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    className="border border-gray-300 rounded h-[85%]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            {successMessage && <p className="text-green-600">{successMessage}</p>}
                            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

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
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussHero;
