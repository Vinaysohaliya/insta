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
    if (user) {
      async function fetchPosts() {
        try {
          const allPosts = await service.getMyPosts(user.$id);
          setPosts(allPosts.documents);
          dispatch(setPost(allPosts.documents));
        } catch (error) {
          console.log(error);
        }
      }

      fetchPosts();
    }
  }, [user, dispatch]); 

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
            myId={user.$id}
            documentsId={post.$id}
          />
        ))}
    </div>
  );
};

export default MyPost;
