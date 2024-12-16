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
        <div className="relative">
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
                {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg border-r h-full 
                transition-[width] duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isExpanded ? 'w-64' : 'w-20'}
                md:translate-x-0 md:relative`}
            >
                <div className="flex flex-col justify-between h-full">
                    {/* Top Section */}
                    <div>
                        {/* Logo and Expand Button */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <img
                                src={logo}
                                alt="logo"
                                className={`h-10 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}
                            />
                            <button
                                onClick={toggleExpand}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                {isExpanded ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="mt-4 space-y-2">
                            <NavItem
                                to="/"
                                icon={<HomeOutlinedIcon />}
                                label="Home"
                                isExpanded={isExpanded}
                                active={location.pathname === '/'}
                            />
                            <NavItem
                                to="/competition"
                                icon={<LocalLibraryIcon />}
                                label="Competition"
                                isExpanded={isExpanded}
                                active={location.pathname === '/competition'}
                            />
                            <NavItem
                                to="/course"
                                icon={<AutoStoriesOutlinedIcon />}
                                label="Course"
                                isExpanded={isExpanded}
                                active={location.pathname === '/course'}
                            />
                            <NavItem
                                to="/notebook"
                                icon={<ChatOutlinedIcon />}
                                label="Notebook"
                                isExpanded={isExpanded}
                                active={location.pathname === '/notebook'}
                            />
                            <NavItem
                                to="/discussion"
                                icon={<ChatOutlinedIcon />}
                                label="Discussion"
                                isExpanded={isExpanded}
                                active={location.pathname === '/discussion'}
                            />
                            <NavItem
                                to="/user"
                                icon={<AccountCircleOutlinedIcon />}
                                label="Dashboard"
                                isExpanded={isExpanded}
                                active={location.pathname === '/user'}
                            />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 px-4 py-2 w-full text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all ${isExpanded ? 'justify-start' : 'justify-center'}`}
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
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-10V5a2 2 0 10-4 0v1"
                                />
                            </svg>
                            {isExpanded && <span className="text-lg">Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, isExpanded, active }) => {
    return (
        <Link
            to={to}
            className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-all 
            ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}
            ${isExpanded ? 'justify-start' : 'justify-center'}`}
        >
            <span className="text-xl">{icon}</span>
            {isExpanded && <span className="text-lg font-medium">{label}</span>}
        </Link>
    );
};

export default Sidebar;
