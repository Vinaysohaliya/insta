import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userService from '../Appwrite/user';

const PostCard = ({ featuredImage, location, caption, userId }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResult = await userService.getUser(userId);
        setUser(userResult.documents[0]);
        console.log(userResult);
        console.log(user);
        const img = await service.getFilePreview(featuredImage);
        setFilePreview(img.href);

        const profileImgResult = await service.getFilePreview(userResult.documents[0].profileId);
        setProfileImg(profileImgResult.href);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId, featuredImage]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4">
      <div className="p-4">
        <div className="mb-2">
          <p className="font-bold">{user?.name}</p>
        </div>

        <div className="flex items-center mb-2">
          <p className="text-gray-600">{location}</p>
        </div>

        <div className="mb-2">
          {profileImg && (
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-full h-12 w-12 mr-2"
            />
          )}
        </div>

        <div className="w-full flex justify-center mb-4">
          {filePreview && <img src={filePreview} className="rounded-xl" alt="Post" />}
        </div>

        <div className="mb-2">
          <p className="text-gray-800">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
