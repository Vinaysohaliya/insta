import React, { useEffect, useState } from 'react';
import userService from '../Appwrite/user';
import postService from '../Appwrite/post';
import { useSelector } from 'react-redux';
import Header from '../pages/Header';
import PostCard from '../Components/PostCard';
import Signup from './Signup';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const Home = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [NoFollows, setNoFollows] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData) {
          const followingResult = await userService.getMyFollowing(userData.$id);
          if (followingResult && followingResult.length > 0) {
            setFollowedUsers(followingResult);

            const postsPromises = followingResult.map((userId) => postService.getMyPosts(userId));
            const postsResults = await Promise.all(postsPromises);
            const allFollowedPosts = postsResults.flatMap((result) => result.documents);

            const shuffledPosts = fisherYatesShuffle(allFollowedPosts);

            setFollowedPosts(shuffledPosts);
          } else {
            setNoFollows("Follow people to view posts.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userData]);

  const fisherYatesShuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  return (
    <div className=''>
      {userData ? (

        <div className=' flex  '>
        <Header />

          <div className=' h-screen overflow-scroll w-3/4'>
            {followedUsers.length !== 0 ? (
              followedPosts.map((post) => (
                <div key={post.$id}>
                  <PostCard
                    location={post.location}
                    caption={post.caption}
                    featuredImage={post.img}
                    userId={post.userId}
                    myId={userData.$id}
                    documentsId={post.$id}
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: '#555' }}>

                <Link to='/allpost'>{NoFollows}</Link>
              </div>
            )}
          </div>

        </div>
      ) : (
        <Signup />
      )}
    </div>
  );
};

export default Home;
