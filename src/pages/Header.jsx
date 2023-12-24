
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/authSlice';
import authObj from '../Appwrite/auth';
import { Link } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.userData);
  const userStatus = useSelector((state)=>state.auth.status);
  const handleLogout = () => {
    try {
        authObj.logout();
        dispatch(logout());


    } catch (error) {
        throw error;
    }
  };

  useEffect(() => {
    function AllUser() {
      try {
         authObj.AllUser();
      } catch (error) {
        console.log(error);
      }
    }
    // AllUser();
  }, []);

  return (
    <div className="flex justify-between p-4 bg-blue-500 text-white">
      <div>
        <h1 className="text-lg font-bold">Your App Name</h1>
      </div>
      <div>
        {userStatus ? (
          <>
            <p className="mr-4">{`Welcome, ${user.name}!`}</p>
            <button onClick={handleLogout} className="underline cursor-pointer">
              Logout
            </button>
            <Link to='/addpost'>AddPost</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
