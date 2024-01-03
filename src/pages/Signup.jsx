import React, { useState } from 'react';
import { login } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';
import authObj from '../Appwrite/auth.js';
import { Link, useNavigate } from 'react-router-dom';
import service from '../Appwrite/post.js';
import userservice, { userService } from '../Appwrite/user.js';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    img: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImg = (event) => {
    try {
      const img = event.target.files[0];
      setFormData({ ...formData, img });
      console.log(img);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.img) {

        const userData = await authObj.createAccount({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        const file = formData.img && await service.createFile(formData.img);

        const userCollection = userservice.createUser({ profileId: file.$id, userId: userData.userId, name: formData.name })

        if (userData && userCollection) {
          const userData2 = await authObj.getuser();
          if (userData2) dispatch(login(userData2));
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 flex flex-col items-center justify-center rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign up to Instagram</h2>
        <form onSubmit={handleSubmit}>
          <label>Profile Img
            <div className="bg-gray-200 p-4 rounded-lg text-center w-80">
              {formData.img ? 'Image Selected' : 'Choose an Image'}
            </div>
            <input className=' hidden' type="file" name="img" onChange={handleImg} required /></label>
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
        <div className=' flex flex-col justify-center items-center'>
          <p>Have an Account? </p>
          <Link to='/login' className=' hover:text-blue-500'>Login</Link>

        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          By signing up, you agree to our Terms, Data Policy, and Cookies Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;
