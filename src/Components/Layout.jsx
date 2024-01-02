import React from 'react';
import Header from '../pages/Header';

const Layout = ({children}) => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
