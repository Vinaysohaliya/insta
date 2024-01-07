import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../pages/Header'; 
const RootLayout = () => {
  return (
    <div className='h-screen overflow-hidden flex '>
      <div className='w-1/4 shadow-lg  '>
        <Header />
      </div>

      <div className='w-3/4 overflow-scroll '>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
