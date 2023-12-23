
import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';

const PostCard = ({ featuredImage, location, caption }) => {
  const [filePreview, setFilePreview] = useState();

  useEffect(() => {
    async function fetchImg() {
      try {
        console.log(featuredImage);
        const img = await service.getFilePreview(featuredImage);
        console.log(img);
        setFilePreview(img.href);
      } catch (error) {
        console.log(error);
      }
    }
    fetchImg();
  }, [featuredImage]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
          <p className="text-gray-600">{location}</p>
        </div>

        <div className="w-full flex justify-center mb-4">
          {filePreview && <img src={filePreview} className="rounded-xl" alt="Post" />}
        </div>

        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
          <p className="text-gray-800">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
