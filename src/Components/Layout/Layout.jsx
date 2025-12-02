import React from 'react';
import NavBar from './Header/NavBar';
import AsideMenu from './Aside/AsideMenu';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Modern Header */}
            <header className='fixed top-0 right-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg z-50'>
                <NavBar />
            </header>
            
            {/* Main Layout Grid */}
            <div className="flex w-full h-screen pt-16">
                {/* Left Sidebar */}
                <aside className='fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-xl z-40'>
                    <AsideMenu />
                </aside>
                
                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-0 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="p-6 max-w-full mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
