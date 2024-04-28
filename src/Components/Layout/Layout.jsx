import React from 'react';
import NavBar from '../Header/NavBar';
import AsideMenu from './Aside/AsideMenu';
import AsideMenuRight from './Aside/AsideMenuRight';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="grid grid-cols-custom w-full">
                <div className='col-start-1'>
                    <AsideMenu />
                </div>
                <main className="p-6 col-start-2 col-end-12">
                    {children}
                </main>
                <div className='col-end-13'>
                    <AsideMenuRight />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
