// AddPostPage.js

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import service from '../Appwrite/post';


const AddPostPage = () => {


  const user = useSelector((state)=>state.auth.userData);

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

  const handleSubmit =async () => {
    try {
        const file=postDetails.image && await service.createFile(postDetails.image);
        console.log(file);
        if (file) {
            const post=await service.createPost({img:file.$id,location:postDetails.location,userId:user.userId,caption:postDetails.caption})
            console.log(post);
        }
    } catch (error) {
        console.log(error);
    }


  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Post</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />

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
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
      >
        Share
      </button>
    </div>
  );
};

export default AddPostPage;
