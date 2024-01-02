import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import service from '../Appwrite/post';
import { useNavigate } from 'react-router-dom';

const AddPostPage = () => {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [postDetails, setPostDetails] = useState({
    image: null,
    caption: '',
    location: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPostDetails({ ...postDetails, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setPostDetails({ ...postDetails, image: file });
  };

  const handleSubmit = async () => {
    try {
      const file = postDetails.image && (await service.createFile(postDetails.image));
      if (file) {
        const post = await service.createPost({
          img: file.$id,
          location: postDetails.location,
          userId: user.$id,
          caption: postDetails.caption,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Post</h1>

      <label htmlFor="image" className="block mb-4 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="bg-gray-200 p-4 rounded-lg text-center">
          {postDetails.image ? 'Image Selected' : 'Choose an Image'}
        </div>
      </label>

      <textarea
        name="caption"
        placeholder="Enter your caption..."
        value={postDetails.caption}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={postDetails.location}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {postDetails.image && (
        <img
          src={URL.createObjectURL(postDetails.image)}
          alt="Preview"
          className="max-w-full h-auto mb-4 rounded"
        />
      )}

      <button
        onClick={handleSubmit}
        className=" border-2 border-black  py-2 px-4 rounded hover:bg-slate-400 focus:outline-none transition-colors duration-300"
      >
        Share
      </button>
    </div>
  );
};

export default AddPostPage;
