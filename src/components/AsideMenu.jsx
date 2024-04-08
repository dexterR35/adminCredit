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
        <aside className='h-screen bg-green-300 max-w-[20%]'>
            <nav>
                <ul>
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
