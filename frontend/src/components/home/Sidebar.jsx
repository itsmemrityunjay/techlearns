import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import logo from "../../assets/Logo.png";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/signin');
                console.log('User signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <>
            <div className="relative">

                <div className=''>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded primary-bg text-white"
                    >
                        {isOpen ? 'Close' : 'Menu'}
                    </button>
                </div>


                <div
                    className={`fixed inset-y-0 h-full left-0 z-40 transition-transform transform bg-white border-e 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isExpanded ? 'w-60' : 'w-20'}  
                md:translate-x-0 md:relative`}
                >
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex flex-row gap-3 justify-between items-end lg:items-start px-4 py-2">

                                <button
                                    onClick={toggleExpand}
                                    className="p-2 rounded secondary-bg primary-text hidden md:block"
                                >

                                    <span
                                        className={`transform transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    >
                                        {isExpanded ? <CloseIcon /> : <MenuIcon />}
                                    </span>
                                </button>


                                <div className="inline-flex w-full items-start justify-start">
                                    <span className="grid size-40 place-content-center lg:place-content-start rounded-lg pt-6 lg:pt-0 text-xs text-gray-600">
                                        {isExpanded ? <img src={logo} alt="logo" /> : null}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100">
                                <div className="px-2">
                                    <div className="py-4">
                                        <Link
                                            to="/"
                                            className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[--primary-color] dark-text'
                                                } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                        >
                                            <HomeOutlinedIcon />
                                            {isExpanded && <span className="text-lg">Home</span>}
                                        </Link>
                                    </div>

                                    <ul className="space-y-1 border-t border-gray-100 pt-4">
                                        <li>
                                            <Link
                                                to="/competition"
                                                className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/competition' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500'
                                                    } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                {isExpanded && <span className="text-lg">Competition</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/course"
                                                className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/course' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500'
                                                    } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                            >
                                                <LocalLibraryIcon />
                                                {isExpanded && <span className="text-lg">Course</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/notebook"
                                                className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/notebook' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500'
                                                    } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                            >
                                                <AutoStoriesOutlinedIcon />
                                                {isExpanded && <span className="text-lg">Notebook</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/discussion"
                                                className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/discussion' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500'
                                                    } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                            >
                                                <ChatOutlinedIcon />
                                                {isExpanded && <span className="text-lg">Discussion</span>}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/User"
                                                className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-all ${location.pathname === '/signin' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500'
                                                    } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                                            >
                                                <AccountCircleOutlinedIcon />
                                                {isExpanded && <span className="text-lg">Dashboard</span>}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className={`group flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all ${isExpanded ? 'justify-start' : 'justify-center'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-10V5a2 2 0 10-4 0v1"
                                    />
                                </svg>
                                {isExpanded && <span className="text-lg">Logout</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

