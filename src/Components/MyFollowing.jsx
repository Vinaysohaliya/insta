import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import { useParams } from 'react-router-dom';
import UserShortProfile from './UserShortProfile';
import { useSelector } from 'react-redux';
import Loader from '../Components/Loader/Loader'; 

const MyFollowing = () => {
  const { userId } = useParams();
  const [followings, setFollowings] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        setIsLoading(true); 
        const followingsData = await userservice.getMyFollowing(userId);
        setFollowings(followingsData);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFollowings();
  }, [userId, userData]);

  async function handleUnfollow(followingId, userId) {
    try {
      setIsLoading(true); 

      await userservice.unfollowUser(followingId, userId);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Following </h2>

      {isLoading ? (
        <Loader /> 
      ) : (
        <>
          {followings.length === 0 ? (
            <p className=" text-center">You are not following anyone.</p>
          ) : (
            <ul>
              {followings.map((following) => (
                <li key={following} className="flex items-center justify-between mb-4 border-b pb-2">
                  <UserShortProfile followerId={following} myId={userId} />
                  {userData && (
                    <div>
                      {userData.$id === userId && (
                        <button
                          onClick={() => handleUnfollow(following, userId)}
                          className="text-red-500 hover:text-red-700 focus:outline-none border-2 border-black p-1 rounded-lg"
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default MyFollowing;
