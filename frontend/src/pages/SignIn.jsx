import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function KaggleSignIn() {
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for showing/hiding password
    const [errorMessage, setErrorMessage] = useState('');
    const [resetMessage, setResetMessage] = useState(''); // New state for reset password feedback
    const navigate = useNavigate();

    // Check if the user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is already logged in, redirect to dashboard
                navigate('/user');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    // Google Sign-In
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate('/user');  // Redirect on successful Google sign-in
                console.log('Google sign-in successful:', result.user);
            })
            .catch((error) => {
                console.error('Error with Google sign-in:', error);
                toast.error('Failed to sign in with Google. Please try again.');
            });
    };

    // Email and Password Sign-In
    const handleEmailSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                toast.success('Sign-in successful!');
                navigate('/user');  // Redirect on successful sign-in
            })
            .catch((error) => {
                console.error('Error with email sign-in:', error);
                toast.error('Failed to sign in. Please check your credentials.');
            });
    };

    // Reset Password
    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email to reset your password.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setErrorMessage('');
                toast.success('Password reset email sent. Please check your inbox.');
            })
            .catch((error) => {
                console.error('Error with password reset:', error);
                toast.error('Failed to send password reset email. Please try again.');
            });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-8">
            <div className="bg-white rounded-2xl shadow-lg px-12 py-20 w-full max-w-md">
                <div className="text-center mx-8 mb-8">
                    <h1 className="text-4xl font-bold mb-12">
                        <span className='primary-text'>tech</span><span className='secondary-text'>learns</span>
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 ${activeTab === 'signin' ? 'text-[--secondary-color] border-b-2 border-[--primary-color]' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('signin')}
                    >
                        Sign In
                    </button>
                    <button
                        className={`flex-1 py-2 ${activeTab === 'register' ? 'text-[#20BEFF] border-b-2 border-[#20BEFF]' : 'text-gray-500'}`}
                        onClick={() => navigate("/signup")}  // Navigate to the register page
                    >
                        Register
                    </button>
                </div>

                {/* Google Sign-In Button */}
                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="bg-[--primary-color] text-white font-semibold py-4 rounded-lg mb-4 flex items-center justify-center w-full"
                    >
                        <svg className="w-5 h-5 mr-4 shadow-2xl shadow-black" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Sign In with Email and Password */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}  // Toggle between text and password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.017.156-2.008.454-2.952m15.66 12.729a9.98 9.98 0 001.886-2.854M9.58 9.58a3 3 0 104.24 4.24m-1.68 1.68A5.985 5.985 0 0112 15c-3.314 0-6-2.686-6-6 0-1.114.305-2.156.835-3.055m9.907 9.907C20.825 12.156 21 11.08 21 10c0-5.523-4.477-10-10-10-2.746 0-5.246 1.14-7.051 3.075m14.228 14.229l1.415-1.415m0-10.707a9.978 9.978 0 00-2.516-2.516m-9.726 9.726A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.017.156-2.008.454-2.952m15.66 12.729a9.98 9.98 0 001.886-2.854M9.58 9.58a3 3 0 104.24 4.24m-1.68 1.68A5.985 5.985 0 0112 15c-3.314 0-6-2.686-6-6 0-1.114.305-2.156.835-3.055m9.907 9.907C20.825 12.156 21 11.08 21 10c0-5.523-4.477-10-10-10-2.746 0-5.246 1.14-7.051 3.075m14.228 14.229l1.415-1.415" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.923a10.05 10.05 0 00-.461 2.076C3.39 11.692 3 12.826 3 14c0 3.866 2.239 7.128 5.458 8.58m10.915-3.785C18.464 19.017 15.365 21 12 21c-3.365 0-6.464-1.983-8.373-4.54M3 3l18 18m-2.73-2.73A9.955 9.955 0 0021 14c0-5.523-4.477-10-10-10-1.2 0-2.343.212-3.423.6M12 4a5.985 5.985 0 015.938 5.062m-1.68 1.68A3 3 0 0012 9c-.798 0-1.547.312-2.122.875M7.05 7.05A9.977 9.977 0 0012 4" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button type="submit" className="w-full secondary-bg text-white font-semibold py-3 rounded-lg">
                            Sign In
                        </button>

                        {/* Password Reset */}
                        <button onClick={handlePasswordReset} className="w-full bg-gray-100 secondary-text font-semibold py-3 rounded-lg mt-4">
                            Forgot Password?
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
