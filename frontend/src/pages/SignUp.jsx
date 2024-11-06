// src/SignUp.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../database/Firebase"
import { collection, addDoc } from 'firebase/firestore';
import { registerWithEmail, signInWithGoogle } from '../database/Firebase';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), {
                email,
                role: 'user', // Set as pending for admin approval
                createdAt: new Date(),
            });
            await registerWithEmail(email, password);
            navigate("/user")
            // Handle successful registration (e.g., redirect or show a success message)
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();
            navigate("/user")
            // Handle successful registration with Google (e.g., redirect or show a success message)
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-8">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-20 w-full max-w-md">
                <div className="text-center mx-8 mb-8">
                    <h1 className="text-4xl font-bold mb-8"><span className='primary-text'>tech</span><span className='secondary-text'>learns</span></h1>
                    <h2 className="text-xl text-center mb-8">Welcome!</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="flex flex-col">
                        <button
                            onClick={handleGoogleSignUp}
                            className="bg-[--primary-color] text-white font-semibold py-2 rounded-lg mb-4 flex items-center justify-center"
                        >
                            <span>Register with Google</span>
                        </button>

                        <form onSubmit={handleEmailSignUp}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-[--secondary-color] text-white font-semibold py-2 rounded-lg w-full"
                            >
                                Register with Email
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-4">
                        Have an account? <Link to="/signin" className="text-blue-500">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
