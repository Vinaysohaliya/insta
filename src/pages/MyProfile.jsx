import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import userService from '../Appwrite/user';
import service from '../Appwrite/post';
import OnlyImg from '../Components/OnlyImg';
import { Link } from 'react-router-dom';

const MyProfile = () => {
    const [profileImg, setProfileImg] = useState(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const { userData } = useSelector((state) => state.auth);
    const [mypost, setMyPost] = useState([]);

    useEffect(() => {
        async function fetchUserDetails() {
            if (userData) {
                const { profileImgHref, $id, name } = userData;

                setProfileImg(profileImgHref);

                try {
                    const followerCount = await userService.countFollower($id);
                    const followingCount = await userService.countFollwing($id);

                    setFollowerCount(followerCount);
                    setFollowingCount(followingCount);

                    const post = await service.getMyPosts($id);
                    console.log(post);
                    setMyPost(post.documents);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        fetchUserDetails();
    }, [userData]);

    return (
        <div className="flex items-center justify-center space-x-8 p-4">
            <div className="max-w-xs">
                {profileImg && <img className="rounded-full" src={profileImg} alt="Profile Image" />}
            </div>
            <div>
                {userData ? (
                    <>
                        <p className="text-xl font-semibold">{userData.name}</p>
                        {userData.$id && (
                            <Link to={`/myfollower/${userData.$id}`} className="text-gray-600 hover:underline">
                                Followers: {followerCount}
                            </Link>
                        )}
                        <Link to={`/myfollowing/${userData.$id}`}  className="text-gray-600 hover:underline">
                            Following: {followingCount}
                        </Link>
                    </>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
            {mypost.map((post) => (
                <div key={post.$id}>
                    <OnlyImg featuredImage={post.img} />
                </div>
            ))}
        </div>
    );
};

export default MyProfile;
