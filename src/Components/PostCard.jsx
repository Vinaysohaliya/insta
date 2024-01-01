import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userService from '../Appwrite/user';
import { Client } from 'appwrite';
import config from '../config/config';
import Skeleton from 'react-loading-skeleton';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { SlUserFollow } from "react-icons/sl";

const PostCard = ({ featuredImage, location, caption, userId, myId, documentsId, createdPost }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clicked, setclicked] = useState(false);
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
    setclicked(true);
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
      setclicked(false);
    }
  };

  const handleLike = async () => {
    setIsLiked(true);
    try {
      const addLike = await service.addLike(documentsId, myId);
    } catch (error) {
      console.log(error);
      throw error;
    }
    finally {
      setclicked(false);
    }
  };

  const formattedDate = new Date(createdPost).toLocaleDateString();

  return (
    <div onDoubleClick={handleLike} className={`max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4 `}>
      <div className="p-4">
        <div className="mb-2 flex justify-between items-center">
          <div >
            {user ? (
              <p className="font-bold">{user?.name}</p>
            ) : (
              <Skeleton count={50} />
            )}
          </div>
          <div>
            {String(myId) !== String(userId) && !isFollowing && (

              <SlUserFollow disabled={clicked} style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleFollow} className=' cursor-pointer' />
            )}
          </div>
        </div>

        <div className="mb-2 flex">
          <Link to='/profile' state={{ userId }} className=' cursor-pointer' >
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
          <div className="flex items-center mb-2">
            <span className=' mr-2'><FaLocationDot /></span> {location ? (
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

        <div className=' flex items-center justify-between'>

          {isLiked ? (
            <FcLike style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLike} />
          ) : (
            <CiHeart style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLike} />

          )}
          {like ? (
            <div>{like} likes</div>
          ) : (
            <Skeleton width={60} count={1} height={16} />
          )}
          Created At {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
