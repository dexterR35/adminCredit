import React from 'react';
import { Link } from 'react-router-dom';
import { FcHome, FcBusinessContact, FcCollaboration, FcDebt } from "react-icons/fc";
function AsideMenu() {

    const links = [
        { path: "/", label: "Home", icon: <FcHome size={22} /> },
        { path: "/customers", label: "Clienti Site", icon: <FcBusinessContact size={22} /> },
        { path: "/contractUsers", label: "Clienti Contract", icon: <FcCollaboration size={22} /> },
        { path: "/services", label: "Clienti Deadline", icon: <FcDebt size={22} /> },
    ];

    return (
        <aside className='h-screen bg-white shadow-lg w-52 flex flex-col items-center justify-start mt-10'>
            <h3>Logo img</h3>
            <nav className='h-[60%] mt-10'>
                <ul className='flex flex-col space-y-4 text-md font-bold capitalize'>
                    {links.map((link, index) => (
                        <li key={index} className='flex flex-row space-x-2 items-start justify-start'>
                            {link.icon}
                            <Link to={link.path}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default AsideMenu;
