import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Handle the theme toggle
    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            setTheme(savedTheme);
        } else {
            // Optional: Check system preference for dark mode and apply it
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setTheme('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    }, []);

    // Handle scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <div
            className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled
                ? 'bg-transparent shadow-lg backdrop-blur-md'
                : 'bg-white backdrop-blur-sm'
                }`}
        >
            <nav className="container mx-auto py-4">
                <div className="navbar">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h7"
                                    />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <Link to="/signin" className="text-xl">
                                        SIGNIN
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-xl">
                                        SIGNUP
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/competition" className="text-xl">
                                        COMPETITION
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/course" className="text-xl">
                                        COURSE
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/notebook" className="text-xl">
                                        NOTEBOOK
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/discussion" className="text-xl">
                                        DISCUSSION
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="navbar-center">
                        <a className="text-2xl">
                            <span className="primary-text text-4xl font-semibold">
                                tech
                            </span>
                            <span className="secondary-text text-4xl font-semibold">
                                learns
                            </span>
                        </a>
                    </div>
                    <div className="navbar-end">
                        <label className="grid cursor-pointer place-items-center">
                            {/* <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={handleThemeToggle}
                                className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
                            /> */}
                            {/* <svg
                                className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                            <svg
                                className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg> */}
                        </label>
                        <button
                            className="btn btn-ghost btn-circle ml-2"
                            onClick={() => navigate('/user')}
                        >
                            <div className="indicator">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-10">
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                            alt="User avatar"
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
