import React, { useEffect, useState } from 'react';
import service from '../Appwrite/post';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../Redux/contentSlice';
import PostCard from '../Components/PostCard';
import Loader from '../Components/Loader/Loader';

const AllPost = () => {
  const myId = useSelector((state) => state.auth.userData?.$id);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await service.getPosts();
        const shuffledPost = fisherYatesShuffle(allPosts.documents);
        setPosts(shuffledPost);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    dispatch(setPost(posts));
  }, [dispatch, posts]);

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
    <div className="container mx-auto p-4">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts &&
            posts.map((post) => (
              <PostCard
                key={post.$id}
                createdPost={post.$createdAt}
                caption={post.caption}
                featuredImage={post.img}
                location={post.location}
                userId={post.userId}
                myId={myId}
                documentsId={post.$id}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AllPost;
