import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../Redux/contentSlice';
import PostCard from '../Components/PostCard';

const MyPost = () => {
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Check if user details are available
    if (user) {
      async function fetchPosts() {
        try {
          const allPosts = await service.getMyPosts(user.$id);
          console.log("oj");
          setPosts(allPosts.documents);
          dispatch(setPost(allPosts.documents));
        } catch (error) {
          console.log(error);
          // Handle error gracefully if needed
        }
      }

      // Call the function to fetch posts
      fetchPosts();
    }
  }, [user, dispatch]); // Add user as a dependency

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <PostCard
            key={post.$id}
            name={user ? user.name : ''}
            caption={post.caption}
            featuredImage={post.img}
            location={post.location}
          />
        ))}
    </div>
  );
};

export default MyPost;
