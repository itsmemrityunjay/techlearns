import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { getDatabase, ref, set, get, child } from "firebase/database"; // Firebase DB for storing notebooks
import { FaJs, FaPython, FaCode } from "react-icons/fa";

const Editors = ({ userId }) => {
    const [code, setCode] = useState('// Write your code here');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript'); // default language
    const [notebooks, setNotebooks] = useState([]); // for listing user's notebooks
    const [isEditing, setIsEditing] = useState(false);
    const [selectedNotebook, setSelectedNotebook] = useState(null); // selected notebook for editing
    const [inputFile, setInputFile] = useState(''); // input for code execution

    const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
    const API_KEY = '292d6006e0msh45dec22d646b1fcp1772ebjsne4e23b07d21f'; // Your API key from RapidAPI

    useEffect(() => {
        fetchNotebooks(); // Fetch user's notebooks on load
    }, []);

    const handleRun = async () => {
        const languageMapping = {
            javascript: 63,
            python: 71,
            cpp: 54
        };
        const languageId = languageMapping[language];

        try {
            const response = await axios.post(
                `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
                {
                    source_code: code,
                    language_id: languageId,
                    stdin: inputFile, // Pass the input file content as stdin
                },
                {
                    headers: {
                        'X-RapidAPI-Key': API_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );
            const result = response.data;
            setOutput(result.stdout || result.stderr || 'Error running code');
        } catch (error) {
            setOutput('Error connecting to the compiler API.');
            console.error(error);
        }
    };

    // Fetch user notebooks from the database
    const fetchNotebooks = async () => {
        const db = getDatabase();
        const dbRef = ref(db);

        try {
            const snapshot = await get(child(dbRef, `notebooks/${userId}`));
            if (snapshot.exists()) {
                setNotebooks(snapshot.val());
            } else {
                setNotebooks([]);
            }
        } catch (error) {
            console.error("Error fetching notebooks:", error);
        }
    };

    // Load notebook content into the editor
    const handleNotebookLoad = (notebook) => {
        setSelectedNotebook(notebook);
        setCode(notebook.code);
        setLanguage(notebook.language);
        setIsEditing(true);
    };

    // Save or Update notebook in the database
    const handleSave = () => {
        const db = getDatabase();
        const notebookData = {
            code,
            language,
        };

        const notebookId = selectedNotebook?.id || Date.now().toString(); // use existing id if editing
        set(ref(db, `notebooks/${userId}/${notebookId}`), notebookData)
            .then(() => {
                console.log("Notebook saved successfully!");
                setIsEditing(false);
                fetchNotebooks(); // refresh the notebook list
            })
            .catch((error) => {
                console.error("Error saving notebook:", error);
            });
    };

    // Handle input file upload
    const handleInputUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setInputFile(reader.result); // Set the file content as input
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col w-full h-screen">
            {/* Top bar */}
            <div className="flex bg-gray-100 p-4 border-b border-gray-300">
                <div className="relative">
                <button className="mr-4 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md shadow-sm">
    File
</button>

                    {/* Dropdown for notebooks */}
                    <div className="absolute hidden group-hover:block bg-white shadow-md p-2 mt-2 border">
                        <h3 className="text-md font-semibold">Saved Notebooks</h3>
                        {notebooks.length ? (
                            notebooks.map((nb, index) => (
                                <button
                                    key={index}
                                    className="block px-4 py-2"
                                    onClick={() => handleNotebookLoad(nb)}
                                >
                                    {nb.id || `Notebook ${index + 1}`}
                                </button>
                            ))
                        ) : (
                            <p className="px-4 py-2">No saved notebooks</p>
                        )}
                    </div>
                </div>

                {/* Edit/Save Button */}
                <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="mr-4 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>

                {/* View Menu */}
                <button className="mr-4 px-4 py-2 text-sm font-medium bg-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600 hover:bg-gray-yellow rounded-md shadow-sm">
                        View
                    </button>

                {/* Run Button */}
                <button
                    onClick={handleRun}
                    className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Run
                </button>

               
            </div>

            {/* Main layout */}
            <div className="flex flex-col md:flex-row h-full">
                {/* Code Editor */}
                <div className="flex flex-col flex-1 p-4 border-b md:border-r border-gray-300">
                    <div className="mb-4">
                        <label htmlFor="language" className="block mb-2 font-medium">Choose Language:</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>

                    <Editor
                        height="300px" // Adjust the height for smaller screens
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        className="border border-gray-300 rounded"
                    />

                    <button
                        onClick={handleRun}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-600"
                    >
                        Run Code
                    </button>
                </div>

                {/* Input Upload Section */}
                <div className="flex flex-col w-full md:w-1/4 p-6 h-auto bg-white shadow-md rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Upload Your File
            </h3>
            <div className="flex flex-col items-center">
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-yellow-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                >
                    Choose File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleInputUpload}
                    className="hidden"
                    accept=".txt"
                />
                <p className="mt-2 text-sm text-gray-500">
                    Supported format: <span className="font-semibold">.txt</span>
                </p>
            </div>
        </div>

                {/* Output Section */}
                <div className="flex flex-col w-full md:w-1/4 p-4 h-auto">
                    <h3 className="text-lg font-medium mb-2">Output</h3>
                    <pre className="p-2 bg-gray-100 border border-gray-300 rounded h-full">{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default Editors;
