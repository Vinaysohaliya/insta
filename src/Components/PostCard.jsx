import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userService from '../Appwrite/user';
import { Client } from 'appwrite';
import config from '../config/config';
import Skeleton from 'react-loading-skeleton';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FcLike } from 'react-icons/fc';
import { CiHeart } from 'react-icons/ci';
import { SlUserFollow } from 'react-icons/sl';
import Loader from '../Components/Loader/Loader';

const PostCard = ({ featuredImage, location, caption, userId, myId, documentsId, createdPost }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new Client();

        client.setEndpoint(config.appWriteUrl).setProject(config.appWriteProject);
        client.subscribe(`databases.${config.appWriteDb}.collections.${config.appWritePostCollection}.documents.${documentsId}`, response => {
          const eventPath = `databases.${config.appWriteDb}.collections.${config.appWritePostCollection}.documents.${documentsId}`;
          const arr = eventPath.split(".");
          if (arr.includes(documentsId)) {
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
  }, [userId, featuredImage, myId, like, documentsId]);

  const handleFollow = async () => {
    if (isFollowingLoading) {
      return; // Do nothing if already in progress
    }

    setIsFollowingLoading(true);

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
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleLike = async () => {
    setClicked(true);
    try {
      const addLike = await service.addLike(documentsId, myId);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setClicked(false);
    }
  };

  const formattedDate = new Date(createdPost).toLocaleDateString();

  return (
    <div onDoubleClick={handleLike} className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4">
      {isLoading || isFollowingLoading ? (
        <Loader />
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              {user ? (
                <p className="font-bold">{user?.name}</p>
              ) : (
                <Skeleton width={100} height={16} />
              )}
            </div>
            <div>
              {String(myId) !== String(userId) && !isFollowing && (
                <div onClick={handleFollow} className='bg-blue-500 rounded-full p-1 flex items-center cursor-pointer'>
                  <span className='px-2'>Follow</span><SlUserFollow disabled={isFollowingLoading} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mb-2">
            <Link to='/profile' state={{ userId }} className="cursor-pointer">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="rounded-full h-12 w-12 mr-2"
                />
              ) : (
                <Skeleton circle={true} width={24} height={24} />
              )}
            </Link>
            <div>
              <span className="mr-2"><FaLocationDot /></span>
              {location ? (
                <p className="text-gray-600">{location}</p>
              ) : (
                <Skeleton width={80} height={16} />
              )}
            </div>
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

          <div className="flex items-center justify-between">
            {isLiked ? (
              <FcLike style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLike} />
            ) : (
              <CiHeart style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLike} />
            )}
            {like !== null ? (
              <div>{like} {like === 1 ? 'like' : 'likes'}</div>
            ) : (
              <Skeleton width={60} count={1} height={16} />
            )}
            <span className="text-gray-500">{formattedDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
