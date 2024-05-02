import React from 'react';
import NavBar from '../Header/NavBar';
import AsideMenu from './Aside/AsideMenu';
import AsideMenuRight from './Aside/AsideMenuRight';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="w-full flex flex-row justify-between">
                <div className='col-start-1 bg-indigo-200 w-[10%]'>
                    <AsideMenu />
                </div>
                <main className="p-6 col-start-2 col-end-12 flex-1">
                    {children}
                </main>
                <div className='col-end-13 w-[12%] bg-red-200'>
                    <AsideMenuRight />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
