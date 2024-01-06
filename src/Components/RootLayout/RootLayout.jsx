import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../pages/Header';

const RootLayout = () => {
    return (
        <div className=' h-screen overflow-hidden lg:flex'>
            <div className='lg:w-1/4  shadow-lg  hidden lg:block'>
                <Header />

            </div>

            <div className='lg:w-3/4  overflow-scroll'>
                <Outlet />
            </div>
        </div>
    );
};

export default RootLayout;
