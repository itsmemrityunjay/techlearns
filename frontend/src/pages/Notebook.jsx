import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../database/Firebase";  // Import Firestore db
import Auth from "../database/Auth";
import Editor from "../components/comp/Editor"; // The code editor component
import ReactQuill from 'react-quill';
import Note from "../assets/Notebook.svg";
import 'react-quill/dist/quill.snow.css'; // import styles for react-quill
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from "firebase/firestore";  // Firestore functions
import heroimg from "../components/comp/mainhero.jpg"
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
            // alert("Notebook published successfully!");
            // toast.success('Notebook published successfully!');
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
                <div className="notebook-container" >
                    <div className="flex justify-center items-center mb-8 mt-8" >
                        <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-8xl  p-6 rounded-lg" style={{
                            backgroundImage:`url(${heroimg})`,
                            backgroundSize: "contain", // Ensures the whole image is visible
                            backgroundRepeat: "no-repeat", // Prevents tiling of the image
                            backgroundPosition: "center",
                            height: "450px",
                            width:'100%',
                        }}>

                            {/* Left Section - Title and Description */}
                            <div className="flex-1 mb-6 md:mb-0 mt-32">
                                <h1 className="text-5xl font-bold text-gray-800 mb-4 ml-48">
                                    Logic & Latte
                                </h1>
                                <p className="text-gray-600 mb-6 ml-48  ">
                                Where Code Meets Caffeine and Sparks Creativity, and Limitless Possibilities.
                                </p>
                            </div>

                            {/* Right Section - Image */}
                            {/* <div className="flex-shrink-0 mr-6">
                                <img
                                    src={Note}
                                    alt="Competitions"
                                    width="480"
                                    height="408"
                                    className="w-96 h-auto"
                                />
                            </div> */}

                        </div>
                    </div>
                  
    <h2 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text shadow-sm tracking-tight leading-tight transition-all duration-300 hover:text-gray-900 text-center">
        Create Your Notebook and Code
    </h2>



{/* Title Input */}
<div className="py-4 max-w-xl mx-auto">
    <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
    <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
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
                        className="mb-4 h-[35vh]"
                    />

                    {/* Tags Input */}
<div className="mt-20">
    <label
        htmlFor="tags"
        className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
    >
        Tags (comma-separated):
    </label>
    <div className="relative">
        <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., React, Firebase, Notebook"
            className="w-full p-3 text-sm border rounded-md shadow-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            #️⃣
        </span>
    </div>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Separate tags with commas (e.g., React, Firebase, Notebook).
    </p>
</div>


                {/* Privacy Options */}
<div className="mt-6">
    <label
        htmlFor="privacy"
        className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
    >
        Privacy:
    </label>
    <div className="relative">
        <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full p-3 text-sm border rounded-md shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 dark:text-gray-300 appearance-none transition-all"
        >
            <option value="public">Public</option>
            <option value="private">Private</option>
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
                className="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </div>
    </div>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Select the privacy level for your content.
    </p>
</div>


                    {/* Code Editor */}
                    <div className="mt-6">
                        <Editor onRun={handleRunCode} onCodeChange={setCode} /> {/* Pass setCode to capture editor code */}
                    </div>

                    {/* Publish Button */}
                    <div className="mt-6">
                  
                  
    <button
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 transform transition duration-300 ease-in-out font-semibold tracking-wide ml-4"
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
