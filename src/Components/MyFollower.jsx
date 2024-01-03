import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import { useParams } from 'react-router-dom';
import UserShortProfile from './UserShortProfile';
import { useSelector } from 'react-redux';

const MyFollower = () => {
  const { userId } = useParams();
  const { userData } = useSelector((state) => state.auth);

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersData = await userservice.getMyFollower(userId);
        setFollowers(followersData);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [userId]);

  async function handleRemove(followerId, userId) {
    try {
      await userservice.removefollower(followerId, userId);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Followers </h2>
      <ul>
        {followers.map((follower) => (
          <li key={follower} className="flex items-center justify-between mb-4 border-b pb-2 ">
            <UserShortProfile followerId={follower} myId={userId} />

            {userData && (
              <div>
                {userData.$id === userId && (
                  <button
                    onClick={() => handleRemove(follower, userId)}
                    className="text-red-500 hover:text-red-700 focus:outline-none border-2 border-black p-1 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyFollower;
