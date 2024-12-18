import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './sidebar';
import Footer from './Footer';

const Layout = () => {
    //   const location = useLocation();

    // Render Sidebar, Header, and child pages for all routes except `/`
    return (
        <div className='flex flex-row gap-2'>

            <div className='ml-64'>
                <Sidebar />
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <div className='mb-16'>
                    <Header />
                </div>
                <div className='pb-16'>
                    <Outlet />
                </div>
                <div><Footer/></div>
            </div>
        </div>
    );
};

export default Layout;
