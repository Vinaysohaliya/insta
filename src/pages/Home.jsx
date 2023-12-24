import React from 'react'
import Header from './Header';
import { checkAuthentication } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const Home = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);
  return (
    <div>
      <Header/>
    </div>
  )
}

export default Home;
