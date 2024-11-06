import React from 'react';
import { Link } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../../assets/Logo.png';

const Footer = () => {
    return (
        <footer className="bg-white py-8 border-t">
            <div className="container mx-auto flex flex-col items-center sm:items-start sm:flex-row justify-between">
                {/* Logo */}
                <div className="mb-8 sm:mb-0 mr-8 w-36">
                    <span className="text-2xl ml-4 font-semibold">
                        <img src={logo} alt="logo" />
                    </span>
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row w-full justify-around">
                    {/* Product Links */}
                    <div className="mb-8 sm:mb-0">
                        <h5 className="font-semibold text-gray-700">Product</h5>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/competition" className="text-gray-500 hover:text-gray-900">Competitions</Link></li>
                            <li><Link to="/notebook" className="text-gray-500 hover:text-gray-900">Notebooks</Link></li>
                            <li><Link to="/learn" className="text-gray-500 hover:text-gray-900">Learn</Link></li>
                            <li><Link to="/discuss" className="text-gray-500 hover:text-gray-900">Discussions</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h5 className="font-semibold text-gray-700">Company</h5>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/team" className="text-gray-500 hover:text-gray-900">Our Team</Link></li>
                            <li><Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact Us</Link></li>
                            <li><Link to="/host-competition" className="text-gray-500 hover:text-gray-900">Host a Competition</Link></li>
                            <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900">Terms · Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-8 flex justify-center space-x-6">
                <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                    <TwitterIcon />
                </Link>
                <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                    <LinkedInIcon />
                </Link>
                <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                    <InstagramIcon />
                </Link>
            </div>
        </footer>
    );
};

export default Footer; 