import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../database/Firebase";  // Import Firestore db
import Auth from "../database/Auth";
import Editor from "../components/comp/Editor"; // The code editor component
import ReactQuill from 'react-quill';
import Note from "../assets/Notebook.svg";
import 'react-quill/dist/quill.snow.css'; // import styles for react-quill
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from "firebase/firestore";  // Firestore functions

const Notebook = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');  // Rich text editor content
    const [tags, setTags] = useState('');  // For notebook tags
    const [privacy, setPrivacy] = useState('public');  // Privacy option
    // Emoji picker state
    const [code, setCode] = useState('');  // For code editor content

    // Authenticate user
    onAuthStateChanged(auth, (user) => {
        setUser(user);
    });

    // Function to run the code (from the code editor)
    const handleRunCode = (code) => {
        console.log('Running code:', code);
        toast.success('Code executed successfully!');
    };



    // Function to handle the publish/save functionality
    const handlePublish = async () => {
        const notebook = {
            title: title,  // Notebook title
            content: editorContent,  // Rich text content
            tags: tags.split(',').map(tag => tag.trim()), // Convert tags to array
            privacy,
            code,  // The code from the code editor
            author: user ? user.displayName || user.email : 'Anonymous',
            createdAt: new Date(),  // Timestamp
        };

        try {
            // Save notebook to Firestore
            const docRef = await addDoc(collection(db, "notebooks"), notebook);
            alert("Notebook published successfully!");
            console.log("Notebook published with ID: ", docRef.id);
            toast.success('Notebook published successfully!');
        } catch (error) {
            console.error("Error adding notebook: ", error);
            toast.error('Error publishing notebook!');
        }
    };

    return (
        <div>
            {user ? (
                <div className="notebook-container">
                    <div className="flex justify-center items-center mb-8">
                        <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-8xl bg-white shadow-lg p-6 rounded-lg">

                            {/* Left Section - Title and Description */}
                            <div className="flex-1 mb-6 md:mb-0 mt-14">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4 ml-6">
                                    Logic & Latte
                                </h1>
                                <p className="text-gray-600 mb-6 ml-6">
                                    Where Code Meets Caffeine Creativity.
                                </p>
                            </div>

                            {/* Right Section - Image */}
                            <div className="flex-shrink-0 mr-6">
                                <img
                                    src={Note}
                                    alt="Competitions"
                                    width="480"
                                    height="408"
                                    className="w-96 h-auto"
                                />
                            </div>

                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">Create Your Notebook and Code</h2>

                    {/* Title Input */}
                    <div className="py-2">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                        placeholder="Write your notes here..."
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['link', 'image', 'video'],
                                ['clean'],
                            ],
                        }}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent', 'link', 'image', 'video',
                            'color', 'background', 'align', 'script',
                        ]}
                        className="mb-4 h-[45vh]"
                    />

                    {/* Tags Input */}
                    <div className="mt-12 ">
                        <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-700">
                            Tags (comma-separated):
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., React, Firebase, Notebook"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {/* Privacy Options */}
                    <div className="mt-4">
                        <label htmlFor="privacy" className="block mb-2 text-sm font-medium text-gray-700">
                            Privacy:
                        </label>
                        <select
                            id="privacy"
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* Code Editor */}
                    <div className="mt-6">
                        <Editor onRun={handleRunCode} onCodeChange={setCode} /> {/* Pass setCode to capture editor code */}
                    </div>

                    {/* Publish Button */}
                    <div className="mt-6">
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            onClick={handlePublish}
                        >
                            Publish Notebook and Code
                        </button>
                    </div>
                </div>
            ) : (
                <Auth onAuth={() => setUser(auth.currentUser)} />
            )}
        </div>
    );
};

export default Notebook;
