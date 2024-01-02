import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';

const OnlyImg = ({ featuredImage, myId, userId, documentId }) => {
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const profileImgResult = await service.getFilePreview(featuredImage);
        setProfileImg(profileImgResult.href);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    }

    fetchProfileImage();
  }, [featuredImage]);

  function removeImg() {
    const deleteimg = service.deleteFile(featuredImage);
    const deletePost = service.deletePost(documentId);
  }
  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-xs">
        {profileImg && (
          <div className="relative">
            <img
              className="rounded-full h-20 w-20 object-cover border border-gray-300"
              src={profileImg}
              alt="Profile Image"
            />
            {myId === userId ? (
              <button
                onClick={removeImg}
                className="absolute bottom-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Delete
              </button>
            ):(null)}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlyImg;
