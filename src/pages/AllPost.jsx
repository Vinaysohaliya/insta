import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../Redux/contentSlice';
import PostCard from '../Components/PostCard';

const AllPost = () => {
  const user = useSelector((state)=>state.auth.userData);
    
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await service.getPosts();
        console.log(allPosts.documents);
        setPosts(allPosts.documents);
        dispatch(setPost(allPosts.documents));
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <PostCard key={post.$id} name={user.name} caption={post.caption} featuredImage={post.img} location={post.location} />
        ))}
    </div>
  );
};

export default AllPost;
