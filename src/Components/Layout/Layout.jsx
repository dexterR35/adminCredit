import React from 'react';
import NavBar from './Header/NavBar';
import AsideMenu from './Aside/AsideMenu';
import AsideMenuRight from './Aside/AsideMenuRight';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <div className='fixed right-0 w-full bg-white z-50'>
            <NavBar />
            </div>
            <div className="grid grid-cols-custom-12 w-full h-[92vh] top-16 relative">
                <div className='col-start-1 fixed left-0 h-full'>
                    <AsideMenu />
                </div>
                <main className="p-6 col-start-2 col-end-12 flex-1 bg-white">
                    {children}
                </main>
                <div className='col-end-13 fixed right-0 h-full'>
                    <AsideMenuRight />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
