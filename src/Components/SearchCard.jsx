import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import userservice from '../Appwrite/user';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const SearchCard = ({ name, profileId, userId }) => {
    const myId = useSelector((state) => state.auth.userData?.$id);
    const [profileImg, setProfileImg] = useState('');
    const [clicked, setClicked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const img = await service.getFilePreview(profileId);
                setProfileImg(img);

                const isFollows = await userservice.isFollowing(myId, userId);
                setIsFollowing(isFollows);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

    }, [myId, userId, profileId, isFollowing]);

    const handleFollow = async () => {
        setClicked(true);
        try {
            const isFollowingValue = await userservice.isFollowing(myId, userId);
            if (!isFollowingValue) {
                const follower = await userservice.addFollower(myId, userId);
                const following = await userservice.addFollowing(myId, userId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setClicked(false);
        }
    };

    return (
        <div className="flex items-center border-b border-gray-200 py-2">
            <Link to='/profile' state={{ userId }} alt="profileImg" className="w-10 h-10 rounded-full mr-4 cursor-pointer"  >
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
            <div className="flex-grow">
                <div className="font-bold">{name}</div>
                {!isFollowing && myId !== userId && (
                    <button
                        onClick={handleFollow}
                        disabled={clicked}
                        className="bg-blue-500 text-white py-1 px-2 rounded-full text-sm cursor-pointer"
                    >
                        Follow
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchCard;
