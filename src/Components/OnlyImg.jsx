import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';

const OnlyImg = ({ featuredImage }) => {
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

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-xs">
        {profileImg && (
          <img
            className="rounded-full h-20 w-20 object-cover"
            src={profileImg}
            alt="Profile Image"
          />
        )}
      </div>
    </div>
  );
};

export default OnlyImg;
