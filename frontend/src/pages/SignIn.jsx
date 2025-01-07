import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../database/Firebase';
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
            .then(async (result) => {
                navigate('/user');  // Redirect on successful Google sign-in
                const User = result.user;
                try {
                    await addDoc(collection(db, 'users'), {
                        createdAt: new Date(),
                        role: "user", // Set as pending for admin approval
                        email: User.email,
                    });
                }
                catch (dbError) {
                    console.error('Error saving user data to Firestore:', dbError);
                    toast.error('Failed to save user data. Please try again.');
                }
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
                                    className="absolute top-2 right-4 cursor-pointer"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Password Reset Link */}
                    <div className="text-sm text-center">
                        <button
                            onClick={handlePasswordReset}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
