import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/Home/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            
            <div className='pt-8'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;