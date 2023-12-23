// Login.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/authSlice';
import authObj from '../Appwrite/auth.js';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const session = await authObj.login(formData);
            if (session) {
                const userData = await authObj.getuser();
                if (userData) dispatch(login(userData));
                navigate("/")  
            }
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full md:w-96">
                <h2 className="text-3xl font-bold mb-6 text-center">Login to Instagram</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input mt-1 block w-full border-2 border-black"
                            required
                        />
                    </label>
                    <label className="block mb-4">
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input mt-1 block w-full border-2 border-black"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Forgot Password?</p>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
