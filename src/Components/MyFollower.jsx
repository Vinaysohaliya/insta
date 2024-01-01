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
                console.log(followersData);
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
        <div>
            <h2>Followers for User {userId}</h2>
            <ul>
                {followers.map((follower) => (
                    <li key={follower}>
                        <UserShortProfile followerId={follower} myId={userId} />
                        
                        {(userData.$id === userId)?<button onClick={() => handleRemove(follower, userId)}>Remove</button>:null}
                        
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFollower;
