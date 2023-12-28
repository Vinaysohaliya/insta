import React, { useEffect, useState } from 'react'
import userservice from '../Appwrite/user';
import service from '../Appwrite/post';

const UserShortProfile = ({ followerId ,myId}) => {
    const [user, setuser] = useState(null);
    const [img, setimg] = useState(null);
    useEffect(() => {
        async function userDetail() {
            const userDetail = await userservice.getUser(followerId);
            if (userDetail.documents.length > 0) {
                const user = userDetail.documents[0];
                setuser(user);
                const profileImg = user && await service.getFilePreview(user.profileId);
                setimg(profileImg);
            }
        }
        userDetail();
    }, [followerId]);

   
    
    return (
            <div>
                {img && <img src={img} alt="User Profile" />}
                <div>
                    {user && user.name}
                </div>
            </div>
        
    )
}

export default UserShortProfile