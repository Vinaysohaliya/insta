import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useSelector } from 'react-redux';
import Loader from '../Components/Loader/Loader';

const OnlyImg = ({ featuredImage, userId, documentId }) => {
  const [profileImg, setProfileImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const myId = useSelector((state) => state.auth.userData.$id);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImgResult = await service.getFilePreview(featuredImage);
        setProfileImg(profileImgResult.href);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [featuredImage]);

  const removeImg = async () => {
    try {
      setIsLoading(true);

      await service.deleteFile(featuredImage);
      await service.deletePost(documentId);
    } catch (error) {
      console.error('Error removing image or post:', error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (

    <div>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className="flex items-center justify-center p-4">
            <div className="max-w-xs">
              {profileImg && (
                <div className="relative">
                  <img
                    className="w-52 object-cover border border-gray-300"
                    src={profileImg}
                    alt="Profile Image"
                  />
                  {String(myId) === String(userId) && (
                    <button
                      onClick={removeImg}
                      className="bottom-0 right-0 p-1 bg-red-500  text-white cursor-pointer rounded hover:bg-red-600"
                    >
                      Delete

                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }
    </div>

  );
};

export default OnlyImg;
