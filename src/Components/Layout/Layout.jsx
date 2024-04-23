import React from 'react';
import Nav from '../Header/NavBar';
import AsideMenu from '../Aside/AsideMenu';
import AsideMenuRight from '../Aside/AsideMenu';

const Layout = ({ children }) => {
    return (
        <div className="flex">
            <Nav />
            <div className="flex-grow">
                <AsideMenu />
                <main className="flex-grow p-4">
                    {children}
                </main>AsideMenuRight
                <AsideMenuRight />
            </div>
        </div>
    );
};

export default Layout;
