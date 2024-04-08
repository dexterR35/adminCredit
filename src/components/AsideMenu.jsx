import React from 'react';
import { Link } from 'react-router-dom';

function AsideMenu() {

    const links = [
        { path: "/", label: "Home" },
        { path: "/user-data", label: "Clienti Site" },
        { path: "/about", label: "Clienti Contract" },
        { path: "/services", label: "Clienti Deadline" },
    ];

    return (
        <aside className='h-screen bg-red-300 w-52'>
            <nav className='h-[60%] mt-20 ml-6'>
                <ul className='flex flex-col space-y-4 text-md font-bold capitalize'>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default AsideMenu;
