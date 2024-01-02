import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import { useParams } from 'react-router-dom';
import UserShortProfile from './UserShortProfile';
import { useSelector } from 'react-redux';

const MyFollowing = () => {
    const { userId } = useParams();
    const [followings, setFollowings] = useState([]);

    const { userData } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                const followingsData = await userservice.getMyFollowing(userId);
                console.log(followingsData);
                setFollowings(followingsData);

            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        fetchFollowings();
    }, [userId,userData]);

    async function handleRemove(followingId, userId) {
        try {
            await userservice.unfollowUser(followingId, userId);
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return (
        <div>
            <h2>Followers for User {userId}</h2>
            <ul>
                {followings.map((following) => (
                    <li key={following}>
                        <UserShortProfile followerId={following} myId={userId} />
                        {userData && (
                            <div>
                        {(userData.$id === userId)?<button onClick={() => handleRemove(following, userId)}>Unfollow</button>:null}

                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFollowing;
