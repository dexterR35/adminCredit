import React from 'react';
import { Link } from 'react-router-dom';
import IconR from "../../utils/_Icon"
import { useTranslation } from 'react-i18next';

function AsideMenu() {
    const { t } = useTranslation();
    const links = [
        { path: "/admin/home", label: t('menu.home'), icon: <IconR icon="FcHome" size={22} /> },
        { path: "/admin/customers", label: t('menu.customersSite'), icon: <IconR icon="businessMan" size={22} /> },
        { path: "/admin/contractUsers", label: t('menu.customersContract'), icon: <IconR icon="FcReading" size={22} /> },
        { path: "/admin/createUser", label: t('menu.customersCreate'), icon: <IconR icon="FcOvertime" size={22} /> },
        { path: "/admin/document", label: "fetchCSVData", icon: <IconR icon="businessContact" size={22} /> },
    ];

    return (
        <aside className='h-full bg-white w-full block p-2 px-4 border border-x-2 border-t-0'>
            <h3 className='text-center'>Logo img</h3>
            <nav className='mt-10 p-2'>
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