import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../Redux/contentSlice';
import PostCard from '../Components/PostCard';

const AllPost = () => {
  const myId = useSelector((state) => state.auth.userData?.$id);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await service.getPosts();
        console.log(allPosts);
        setPosts(allPosts.documents);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    dispatch(setPost(posts));
  }, [dispatch, posts]);

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <PostCard
            key={post.$id}
            caption={post.caption}
            featuredImage={post.img}
            location={post.location}
            userId={post.userId}
            myId={myId}
            documentsId={post.$id}
          />
        ))}
    </div>
  );
};

export default AllPost;
