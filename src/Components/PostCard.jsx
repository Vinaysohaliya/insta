import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userService from '../Appwrite/user';
import { Client } from 'appwrite';
import config from '../config/config';
const PostCard = ({ featuredImage, location, caption, userId, myId ,documentsId}) => {

  const [filePreview, setFilePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
const [like, setlike] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new Client();
        client.setEndpoint('https://cloud.appwrite.io/v1').setProject(config.appWriteProject);
        client.subscribe(`databases.${config.appWriteDb}.collections.${config.appWritePostCollection}.documents`, response => {
          // if (response.events.includes("databases.*.collections.*.documents.658faa7b3c124f3070c2.update")) {
            console.log(response);
            const updatedLike = response.payload.like?.length || 0;
            setlike(updatedLike);
          // }
        });

        if (myId) {
          console.log('Effect triggered');
          const userResult = await userService.getUser(userId);
          console.log(userResult);
          setUser(userResult.documents[0]);

          console.log(userResult);

          const img = await service.getFilePreview(featuredImage);
          setFilePreview(img.href);

          const profileImgResult = await service.getFilePreview(userResult.documents[0].profileId);
          setProfileImg(profileImgResult.href);

          const isFollowingValue = await userService.isFollowing(myId, userId);
          setIsFollowing(isFollowingValue);

          const like=await service.getLike(documentsId);
          console.log(like);
          setlike(like)

        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId, featuredImage, myId,like]);



  const handleFollow = async () => {
    try {
      const isFollowingValue = await userService.isFollowing(myId, userId);
      if (!isFollowingValue) {
        const follower = await userService.addFollower(myId, userId);
        const following = await userService.addFollowing(myId, userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike =async ()=>{
    try {
      const addLike=await service.addLike(documentsId,myId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }



  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden my-4">
      <div className="p-4">
        <div className="mb-2">

          {user && <p className="font-bold">{user?.name}</p>}
        </div>
        <div className="flex items-center mb-2">
          <p className="text-gray-600">{location}</p>
        </div>
        <div className="mb-2">
          {profileImg && (
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-full h-12 w-12 mr-2"
            />
          )}
        </div>
        <div className="w-full flex justify-center mb-4">
          {filePreview && <img src={filePreview} className="rounded-xl" alt="Post" />}
        </div>
        <div className="mb-2">
          <p className="text-gray-800">{caption}</p>
        </div>
        {String(myId) !== String(userId) && !isFollowing && (
          <button onClick={handleFollow} className="bg-blue-500 text-white px-4 py-2 rounded">
            Follow
          </button>
        )}
        <div>
        {like && <div>{like}</div>}
        <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded">
            Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
