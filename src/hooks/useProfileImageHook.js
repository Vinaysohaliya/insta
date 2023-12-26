import { useEffect, useState } from 'react';
import service from '../Appwrite/post';

const useProfileImage = (profileId) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        console.log(profileId);
        const profileImg=await service.getFilePreview(profileId);
        console.log(profileImg.href);      
      } catch (error) {
        console.error('Error fetching profile image:', error);
        throw error;
      }
    };

    if (userId) {
      fetchProfileImage();
    } else {
      setProfileImage(null);
    }
  }, [profileId]);

  return profileImage;
};

export default useProfileImage;
