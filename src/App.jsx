import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthentication } from './Redux/authSlice';

import RootLayout from './Components/RootLayout/RootLayout'; // Import your RootLayout component
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AddPost from './pages/AddPost';
import AllPost from './pages/AllPost';
import MyPost from './pages/MyPost';
import MyProfile from './pages/MyProfile';
import MyFollower from './components/MyFollower';
import MyFollowing from './components/MyFollowing';
import EditProfile from './pages/EditProfile';
import AuthLayout from './Components/AuthLayout/AuthLayout';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  return (
    <main>
      <Routes>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AuthLayout />}>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/addpost" element={<AddPost />} />
            <Route path="/allpost" element={<AllPost />} />
            <Route path="/mypost" element={<MyPost />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/myfollower/:userId" element={<MyFollower />} />
            <Route path="/myfollowing/:userId" element={<MyFollowing />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </main>

  );
}

export default App;
