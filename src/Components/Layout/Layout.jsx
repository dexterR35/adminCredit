import React from 'react';
import NavBar from '../Header/NavBar';
import AsideMenu from '../Aside/AsideMenu';
import AsideMenuRight from '../Aside/AsideMenuRight';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="grid grid-cols-12 w-full">
                <div className='col-start-1 col-end-3'>
                    <AsideMenu />
                </div>
                <main className="p-2 col-start-3 col-end-11">
                    {children}
                </main>
                <div className='col-start-11 col-end-13'>
                    <AsideMenuRight />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
