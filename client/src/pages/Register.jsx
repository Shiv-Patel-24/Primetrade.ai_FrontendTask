import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import './Login.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register(formData);
            localStorage.setItem('token', data.token);
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-custom items-center justify-center p-12 text-white text-center">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
                    <p className="text-lg">Create an account to get started and manage your tasks efficiently.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-100 p-8">
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleSubmit}
                        className="p-10 bg-white rounded-xl shadow-lg space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name" type="text" name="name" placeholder="Your Name"
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email" type="email" name="email" placeholder="you@example.com"
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password" type="password" name="password" placeholder="••••••••"
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-white font-semibold bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                           Sign Up
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;