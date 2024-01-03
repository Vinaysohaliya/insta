import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import service from '../Appwrite/post';

const UserShortProfile = ({ followerId, myId }) => {
  const [user, setUser] = useState(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    async function getUserDetails() {
      try {
        const userDetail = await userservice.getUser(followerId);

        if (userDetail.documents.length > 0) {
          const userData = userDetail.documents[0];
          setUser(userData);

          if (userData.profileId) {
            const profileImg = await service.getFilePreview(userData.profileId);
            setImg(profileImg);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    getUserDetails();
  }, [followerId]);

  return (
    <div className="flex items-center space-x-4">
      {img && (
        <img
          src={img}
          alt="User Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      )}
      <div>
        {user && (
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            {user.$id === myId ? (
              <span className="text-xs text-gray-500">You</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserShortProfile;
