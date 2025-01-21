import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import Select from "react-select";
import { FaPlay, FaSave, FaFolderOpen, FaCog,FaJs, FaPython, FaCode } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const Editors = ({ userId }) => {
    const handleChange = (selectedOption) => {
        console.log(selectedOption.value); // Set this to update your state
    };
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [inputFile, setInputFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('vs-dark');
    const [isTyping, setIsTyping] = useState(false);
    const [typewriterIndex, setTypewriterIndex] = useState(0);

    const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
    const API_KEY = '292d6006e0msh45dec22d646b1fcp1772ebjsne4e23b07d21f';

    const handleRun = async () => {
        setLoading(true);

        const languageMapping = {
            javascript: 63,
            python: 71,
            cpp: 54,
        };

        try {
            const response = await axios.post(
                `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
                {
                    source_code: code,
                    language_id: languageMapping[language],
                    stdin: inputFile,
                },
                {
                    headers: {
                        'X-RapidAPI-Key': API_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );
            const result = response.data;
            setOutput(result.stdout || result.stderr || 'Error occurred.');
        } catch (error) {
            setOutput('Error: Unable to process the code.');
        } finally {
            setLoading(false);
        }
    };
    const options = [
        { value: "javascript", label: <><FaJs /> JavaScript</> },
        { value: "python", label: <><FaPython /> Python</> },
        { value: "cpp", label: <><FaCode /> C++</> },
    ];
    const handleSave = async () => {
        if (!userId) {
            alert('Please log in to save your code.');
            return;
        }
        try {
            const db = getDatabase();
            await set(ref(db, 'users/' + userId + '/code'), {
                code,
                language,
            });
            alert('Code saved successfully!');
        } catch (error) {
            alert('Error saving the code.');
        }
    };

    const handleLoad = async () => {
        if (!userId) {
            alert('Please log in to load your code.');
            return;
        }
        try {
            const db = getDatabase();
            const snapshot = await get(child(ref(db), 'users/' + userId + '/code'));
            if (snapshot.exists()) {
                const savedCode = snapshot.val();
                setCode(savedCode.code);
                setLanguage(savedCode.language);
                alert('Code loaded successfully!');
            } else {
                alert('No saved code found.');
            }
        } catch (error) {
            alert('Error loading the code.');
        }
    };
    const customStyles = {
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? "yellow" : "#E5E7EB",
          boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.5)" : "none",
          "&:hover": {
            borderColor: "#4F46E5",
          },
         
       
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#4F46E5" : "#FFFFFF",
          color: state.isFocused ? "#FFFFFF" : "#000000",
          "&:hover": {
            backgroundColor: "#4F46E5",
            color: "#FFFFFF",
          },
          
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      
        }),
      };
    const handleDelete = () => {
        setCode('');
        setOutput('');
    };

    const handleThemeChange = () => {
        setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
    };

    // Typewriter effect function
    const typeWriterEffect = (text, index = 0) => {
        if (index < text.length) {
            setCode((prevCode) => prevCode + text.charAt(index));
            setTypewriterIndex(index + 1);
        } else {
            setIsTyping(false); // Stop typing when done
        }
    };

    const startTypewriter = (text) => {
        setCode('');
        setIsTyping(true);
        let index = 0;
        setTypewriterIndex(index);
        const typingInterval = setInterval(() => {
            typeWriterEffect(text, index);
            index++;
            if (index >= text.length) {
                clearInterval(typingInterval); // Stop the interval when done
            }
        }, 100); // Adjust typing speed here (ms per character)
    };

    // Example of initializing typewriter effect with a default code (optional)
    useEffect(() => {
        const sampleCode = `// Sample JavaScript Code
function greet(name) {
  return 'Hello, ' + name;
}

console.log(greet('World'));`;
        if (!isTyping && !code) {
            startTypewriter(sampleCode);
        }
    }, [isTyping, code]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
            {/* Header Section */}
            <header className="flex justify-between items-center px-6 py-4 bg-yellow-400 shadow-lg">

                <h1 className="text-2xl font-bold tracking-wide">💻 Code Editor</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleRun}
                        className="flex items-center px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 shadow-md transition-all duration-300"
                    >
                        <FaPlay className="mr-2" /> Run
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300"
                    >
                        <FaSave className="mr-2" /> Save
                    </button>
                    <button
                        onClick={handleLoad}
                        className="flex items-center px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 shadow-md transition-all duration-300"
                    >
                        <FaFolderOpen className="mr-2" /> Load
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 shadow-md transition-all duration-300"
                    >
                        <RiDeleteBin5Line className="mr-2" /> Clear
                    </button>
                    <button
                        onClick={handleThemeChange}
                        className="flex items-center px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 shadow-md transition-all duration-300"
                    >
                        <FaCog className="mr-2" /> Theme
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Code Editor Section */}
                <section className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">Code Editor</h2>
                            <p className="text-sm text-gray-400">Write your code below</p>
                        </div>
                        <div className="flex justify-center items-center  bg-gray-100">
      <div className="w-64">
        <Select
          options={options}
          onChange={handleChange}
          styles={customStyles}
         
          classNamePrefix="react-select"
        />
      </div>
    </div>
                    </div>
                    <div className="h-[400px] bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value)}
                            theme={theme}
                        />
                    </div>
                </section>

                {/* Input File Section */}
                <aside className="w-full lg:w-1/4 p-6 bg-gray-900 border-l border-gray-800 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Input</h2>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-black transition-all"
                        >
                            Upload Input File
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files[0]
                                    .text()
                                    .then((text) => setInputFile(text))
                            }
                        />
                        <p className="mt-2 text-sm text-gray-400">
                            Supported format: <span className="text-gray-200">.txt</span>
                        </p>
                    </div>
                </aside>

                {/* Output Section */}
                <aside className="w-full lg:w-1/4 p-6 bg-gray-900 border-l border-gray-800 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Output</h2>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md h-[400px] overflow-auto">
                        {loading ? (
                            <div className="text-center text-yellow-400">
                                Running your code...
                            </div>
                        ) : (
                            <pre className="whitespace-pre-wrap text-sm text-gray-200">{output || 'No output yet.'}</pre>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Editors;