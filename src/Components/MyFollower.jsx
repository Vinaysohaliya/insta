import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import { useParams } from 'react-router-dom';
import UserShortProfile from './UserShortProfile';

const MyFollower = () => {
    const { userId } = useParams();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const followersData = await userservice.getMyFollower(userId);
                console.log(followersData);
                setFollowers(followersData);
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        fetchFollowers();
    }, [userId]);

    async function handleUnfollow(followerId, userId) {
        try {
            await userservice.unfollow(followerId, userId);
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
                {followers.map((follower) => (
                    <li key={follower}>
                        <UserShortProfile followerId={follower} myId={userId} />
                        <button onClick={() => handleUnfollow(follower, userId)}>Unfollow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFollower;
