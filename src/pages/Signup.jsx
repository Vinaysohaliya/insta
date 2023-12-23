import React, { useState } from 'react';
import { login } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';
import authObj from '../Appwrite/auth.js';

const Signup = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

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
      const userData = await authObj.createAccount(formData);
      if (userData) {
        const userData2 = await authObj.getuser();
        if (userData2) dispatch(login(userData2));
        navigate("/")  
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign up to Instagram</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Full Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input mt-1 block w-full border-2 border-black"
              required
            />
          </label>
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          By signing up, you agree to our Terms, Data Policy, and Cookies Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;