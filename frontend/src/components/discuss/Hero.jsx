import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../../database/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import vaishnavi from "../../assets/vaishnavi.jpg";
import form1 from "../comp/form1.jpg";
import { useNavigate } from 'react-router-dom';

const DiscussHero = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        type: 'general', // Set default value
    });
    const [authorName, setAuthorName] = useState('Anonymous');
    const [authorImage, setAuthorImage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/discussForm');
    }

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setAuthorName(user.email || 'Anonymous');
            setAuthorImage(user.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
        } else {
            setAuthorName('Anonymous');
            setAuthorImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
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
            await addDoc(collection(db, 'topics'), {
                ...formData,
                author: authorName,
                authorImage: authorImage,
                createdAt: new Date(),
            });
            setSuccessMessage('Topic published successfully.');
            setShowModal(false);
            setFormData({
                type: 'general',
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
        <div className="container mx-auto py-8 px-4">
            {/* Hero Section */}
            <div className="flex flex-col-reverse lg:flex-row items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm overflow-hidden max-w-7xl mx-auto">
                {/* Text Content */}
                <div className="w-full lg:w-1/2 p-6 lg:p-12 lg:pr-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Join the Discussion
                    </h1>

                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        Discuss the TechLearns platform & machine learning topics – this includes sharing feedback, asking questions, and more.{' '}
                        <a className="text-blue-600 hover:underline font-medium" href="/docs/competitions" target="_blank" rel="noopener noreferrer">
                            Read documentation
                        </a>{' '}
                        or learn about{' '}
                        <a className="text-blue-600 hover:underline font-medium" href="/c/about/community" target="_blank" rel="noopener noreferrer">
                            Community Competitions
                        </a>.
                    </p>

                    <button
                        onClick={handleNavigate}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Topic
                    </button>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-auto flex items-center justify-end">
                    <img
                        src={vaishnavi}
                        alt="Join the Discussion"
                        className="w-auto h-[300px] object-cover"
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">Create New Topic</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-1/2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Category</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                        >
                                            <option value="general">General Discussion</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="question">Question</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            required
                                            placeholder="Enter a descriptive title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Share Your Thoughts</label>
                                        <div className="h-64">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.content}
                                                onChange={handleContentChange}
                                                className="h-full bg-white border border-gray-300 rounded-lg"
                                                placeholder="Write your content here..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="separate,by,commas"
                                        />
                                    </div>

                                    {successMessage && (
                                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                            {successMessage}
                                        </div>
                                    )}

                                    {errorMessage && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                            {errorMessage}
                                        </div>
                                    )}
                                </form>

                                {/* Image */}
                                <div className="w-full lg:w-1/2 flex items-center justify-center">
                                    <img
                                        src={form1}
                                        alt="Community Discussion"
                                        className="w-full h-auto max-h-96 rounded-xl object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition"
                            >
                                Publish Topic
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussHero;
