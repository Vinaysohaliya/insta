import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import userService from '../Appwrite/user';
import service from '../Appwrite/post';
import OnlyImg from '../Components/OnlyImg';
import { Link, useLocation } from 'react-router-dom';

const MyProfile = () => {
  const authUser = useSelector((state) => state.auth.userData);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [mypost, setMyPost] = useState([]);

  const location = useLocation();
  const userId = location.state?.userId;

  const targetUserId = userId || (authUser && authUser.$id);

  useEffect(() => {
    async function fetchUserDetails() {
      if (targetUserId) {
        try {
          const userResult = await userService.getUser(targetUserId);
          setUser(userResult.documents[0]);

          const profileImgResult = await service.getFilePreview(userResult.documents[0].profileId);
          setProfileImg(profileImgResult.href);

          const followerCount = await userService.countFollower(targetUserId);
          const followingCount = await userService.countFollwing(targetUserId);

          setFollowerCount(followerCount);
          setFollowingCount(followingCount);

          const post = await service.getMyPosts(targetUserId);
          setMyPost(post.documents);
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchUserDetails();
  }, [targetUserId]);

  return (
    <div className="flex items-center justify-center space-x-8 p-4">
      <div className="max-w-xs">
        {profileImg && (
          <img
            className="rounded-full h-32 w-32 object-cover border-4 border-white"
            src={profileImg}
            alt="Profile Image"
          />
        )}
      </div>
      <div className="text-left">
        {user ? (
          <>
            <p className="text-2xl font-semibold">{user.name}</p>
            {targetUserId && (
              <Link to={`/myfollower/${targetUserId}`} className="text-gray-600 hover:underline">
                Followers: {followerCount}
              </Link>
            )}
            <Link to={`/myfollowing/${targetUserId}`} className="block text-gray-600 hover:underline">
              Following: {followingCount}
            </Link>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {mypost.map((post) => (
          <div key={post.$id} className="overflow-hidden">
            <OnlyImg featuredImage={post.img} documentId={post.$id} myId={authUser.$id} userId={targetUserId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
