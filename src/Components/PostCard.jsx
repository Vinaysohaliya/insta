import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userService from '../Appwrite/user';
import { Client } from 'appwrite';
import config from '../config/config';
import Skeleton from 'react-loading-skeleton';

const PostCard = ({ featuredImage, location, caption, userId, myId, documentsId }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new Client();

        client.setEndpoint(config.appWriteUrl).setProject(config.appWriteProject);
        client.subscribe(`databases.${config.appWriteDb}.collections.${config.appWritePostCollection}.documents`, response => {
          if (response.events.includes(`databases.${config.appWriteDb}.collections.${config.appWritePostCollection}`)) {
            const updatedLike = response.payload.like?.length || 0;
            setLike(updatedLike);
          }
        });

        if (myId) {
          const userResult = await userService.getUser(userId);
          setUser(userResult.documents[0]);

          const img = await service.getFilePreview(featuredImage);
          setFilePreview(img.href);

          const profileImgResult = await service.getFilePreview(userResult.documents[0].profileId);
          setProfileImg(profileImgResult.href);

          const isFollowingValue = await userService.isFollowing(myId, userId);
          setIsFollowing(isFollowingValue);

          const likeCount = await service.getLike(documentsId);
          setLike(likeCount);

          const isLikedValue = await service.isLiked(documentsId, myId);
          setIsLiked(isLikedValue);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, featuredImage, myId, like]);

  const handleFollow = async () => {
    try {
      const isFollowingValue = await userService.isFollowing(myId, userId);
      if (!isFollowingValue) {
        const follower = await userService.addFollower(myId, userId);
        const following = await userService.addFollowing(myId, userId);
        setIsFollowing(true);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    try {
      const addLike = await service.addLike(documentsId, myId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div className={`max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4 `}>
      <div className="p-4">
        <div className="mb-2">
          {user ? (
            <p className="font-bold">{user?.name}</p>
          ) : (
            <Skeleton count={50} /> 
          )}
        </div>
        <div className="flex items-center mb-2">
          {location ? (
            <p className="text-gray-600">{location}</p>
          ) : (
            <Skeleton width={80} height={16} />
          )}
        </div>
        <div className="mb-2">
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-full h-12 w-12 mr-2"
            />
          ) : (
            <Skeleton circle={true} width={24} height={24} />
          )}
        </div>
        <div className="w-full flex justify-center mb-4">
          {filePreview ? (
            <img src={filePreview} className="rounded-xl" alt="Post" />
          ) : (
            <Skeleton width={300} height={200} />
          )}
        </div>
        <div className="mb-2">
          {caption ? (
            <p className="text-gray-800">{caption}</p>
          ) : (
            <Skeleton count={2} />
          )}
        </div>
        {String(myId) !== String(userId) && !isFollowing && (
          <button onClick={handleFollow} className="bg-blue-500 text-white px-4 py-2 rounded">
            Follow
          </button>
        )}
        <div>
          {like ? (
            <div>{like} likes</div>
          ) : (
            <Skeleton width={60} count={1} height={16} />
          )}
          {isLiked ? (
            <button onClick={handleLike} className="bg-red-500 text-white px-4 py-2 rounded">
              Unlike
            </button>
          ) : (
            <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded">
              Like
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
