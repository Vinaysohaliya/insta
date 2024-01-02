import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import userservice from '../Appwrite/user';
import authObj from '../Appwrite/auth';
import Search from '../Components/Search';
import { GoSignOut } from "react-icons/go";
import { FaInstagram } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi";
import '../App.css'

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const userStatus = useSelector((state) => state.auth.status);
  const profileImg = useSelector((state) => state.auth.userData.profileImgHref);

  const handleLogout = () => {
    try {
      authObj.logout();
      dispatch(logout());
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    async function AllUser() {
      try {
        const users = await userservice.getAllUser();
        console.log(users);
      } catch (error) {
        console.log(error);
      }
    }
    AllUser();
  }, []);

  function handleSearchClick() {
    setSearchVisible(!searchVisible);
  }
  
  function handleNavigate() {
    navigate("/profile");
  }

  return (
    <div className="flex header p-4 bg-black text-white h-screen w-1/4 items-center justify-center">
      <div className='overflow-hidden'>
        {userStatus ? (
          <div className='h-screen flex flex-col items-center justify-around'>
            <h1 className="text-lg font-bold flex items-center mb-4">
              <FaInstagram style={{ fontSize: '24px', cursor: 'pointer' }} />
              <span className='px-2 hidden md:inline-block'>Insta</span>
            </h1>

            <div className='flex flex-col items-center'>
              {/* <p className="mr-4 pb-6  ">{`Welcome, ${user.name}!`}</p> */}
              <Link className='pb-6 flex items-center' to='/'>
                <AiOutlineHome style={{ fontSize: '24px', cursor: 'pointer' }} />
                <span className='px-2 hidden md:inline-block'>Home</span>
              </Link>
              {searchVisible ? (
                <div className="fixed top-0 left-0 w-full h-full pb-6 bg-black bg-opacity-60 flex items-center justify-center">
                  <Search setSearchVisible={setSearchVisible} />
                </div>
              ) : (
                <div onClick={handleSearchClick} className="flex pb-6 items-center cursor-pointer">
                  <CiSearch style={{ fontSize: '24px', cursor: 'pointer' }} />
                  <span className='pl-1 hidden md:inline-block'>Search</span>
                </div>
              )}
              <Link to='/addpost' className='flex items-center pb-6'>
                <FiPlusCircle style={{ fontSize: '24px', cursor: 'pointer' }} />
                <span className='px-2 hidden md:inline-block'>Add Post</span>
              </Link>
              <img width={50} onClick={handleNavigate} src={profileImg} className='rounded-full m'></img>
            </div>

            <button onClick={handleLogout} className="cursor-pointer flex justify-center items-center">
              <GoSignOut style={{ fontSize: '24px', cursor: 'pointer' }} />
              <span className='pl-2 hidden md:inline-block'>Logout</span>
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
