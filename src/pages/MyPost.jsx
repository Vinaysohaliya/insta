import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../Redux/contentSlice';
import PostCard from '../Components/PostCard';
import { Link } from 'react-router-dom';

const MyPost = () => {
  const myId = useSelector((state) => state.auth.userData?.$id);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (myId) {
      async function fetchPosts() {
        try {
          const allPosts = await service.getMyPosts(myId);
          setPosts(allPosts.documents);
          dispatch(setPost(allPosts.documents));
        } catch (error) {
          console.log(error);
        }
      }

      fetchPosts();
    }
  }, [myId, dispatch]); 

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 w-screen h-screen flex flex-col  items-center justify-center ">
            <p className="text-lg font-semibold">You haven't posted yet.</p>
            <Link to="/addpost" className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-full">
              Add Post
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              createdPost={post.$createdAt}
              key={post.$id}
              caption={post.caption}
              featuredImage={post.img}
              location={post.location}
              userId={post.userId}
              myId={myId}
              documentsId={post.$id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyPost;
