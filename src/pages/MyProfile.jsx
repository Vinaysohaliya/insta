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
  }, [targetUserId, authUser, userId]);

  return (
    <div className="bg-gradient-to-b from-pink-300  via-purple-300 to-indigo-300 min-h-screen flex flex-col items-center space-y-8 p-4">
      <div className="max-w-xs border-4 border-white rounded-full overflow-hidden">
        {profileImg && (
          <img
            className="rounded-full h-32 w-32 object-cover"
            src={profileImg}
            alt="Profile Image"
          />
        )}
      </div>
      <div className="text-center bg-white bg-opacity-80 p-4 rounded-md">
        {user ? (
          <>
            {
              authUser && authUser.$id === targetUserId ? <Link to="/editprofile" className="flex items-center">
                <span className="px-2 bg-blue-500 rounded-full p-2 text-cyan-50">Edit Profile</span>
              </Link> : null
            }
            <p className="text-2xl font-semibold">{user.name}</p>
            {targetUserId && (
              <div className='flex space-x-4'>
                <Link to={`/myfollower/${targetUserId}`} className="text-gray-600 hover:underline transition duration-300 ease-in-out transform hover:scale-105">
                  <span className="flex items-center">
                    <span className="mr-1">Followers:</span>
                    <span className="font-bold">{followerCount}</span>
                  </span>
                </Link>

                <Link to={`/myfollowing/${targetUserId}`} className="text-gray-600 hover:underline transition duration-300 ease-in-out transform hover:scale-105">
                  <span className="flex items-center">
                    <span className="mr-1">Following:</span>
                    <span className="font-bold">{followingCount}</span>
                  </span>
                </Link>

              </div>
            )}
          </>
        ) : (
          <svg class="animate-pulse h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          </svg>
        )}
        {
          user?.bio ? (
            <p className="text-lg mt-2">{user.bio}</p>
          ) : (
            (authUser && userId && userId !== authUser.$id) ? null : (
              <Link to="/editprofile" className="text-blue-500 underline">
                Add Bio
              </Link>
            )
          )
        }



      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 w-full">
        {mypost.map((post) => (
          <div key={post.$id} className="overflow-hidden relative">
            <OnlyImg featuredImage={post.img} documentId={post.$id} userId={targetUserId} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyProfile;
