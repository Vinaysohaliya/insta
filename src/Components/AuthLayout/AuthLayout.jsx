import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const userStatus = useSelector((state) => state.auth?.status);

  return (
    <div>
      {userStatus ? (
          <>
            <Outlet />
        </>
      ) : (
        <div className='flex items-center justify-center h-screen'>
      <Link
        to='/login'
        className='text-blue-500 underline transition  duration-300 ease-in-out hover:text-blue-700 hover:underline'
      >
        Please Signup/Login
      </Link>
    </div>
      )}
    </div>
  );
};

export default AuthLayout;
