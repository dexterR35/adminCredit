import React from 'react';
import NavBar from './Header/NavBar';
import AsideMenu from './Aside/AsideMenu';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            {/* Modern Header */}
            <header className='fixed top-0 right-0 left-0 w-full bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 z-50'>
                <NavBar />
            </header>
            
            {/* Main Layout Grid */}
            <div className="flex w-full h-screen pt-16">
                {/* Left Sidebar */}
                <aside className='fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 z-40'>
                    <AsideMenu />
                </aside>
                
                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-0 overflow-y-auto bg-slate-900">
                    <div className="p-8 max-w-full mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
