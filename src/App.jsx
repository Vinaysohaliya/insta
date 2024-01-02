import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

import AddPost from './pages/AddPost';
import AllPost from './pages/AllPost';
import MyPost from './pages/MyPost';

import { checkAuthentication } from './Redux/authSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import MyProfile from './pages/MyProfile';
import MyFollower from './Components/myFollower';
import MyFollowing from './Components/MyFollowing';

function App() {

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} ></Route>
        <Route path="/signup" element={<Signup />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/addpost" element={<AddPost />} ></Route>
        <Route path="/allpost" element={<AllPost />} ></Route>
        <Route path="/mypost" element={<MyPost />} ></Route>
        <Route path="/profile" element={<MyProfile/>} ></Route>
        <Route path="/myfollower/:userId" element={<MyFollower />} ></Route>
        <Route path="/myfollowing/:userId" element={<MyFollowing />} ></Route>
        
      </Routes>
    </>
  );
}

export default App;
