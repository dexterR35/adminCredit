import React from 'react';
import { Link } from 'react-router-dom';
import IconR from "../../utils/_Icon"
import { useTranslation } from 'react-i18next';

function AsideMenu() {
    const { t } = useTranslation();
    const links = [
        { path: "/admin/home", label: t('menu.home'), icon: <IconR icon="FcHome" size={18} /> },
        { path: "/admin/customers", label: t('navMenu.customersSite'), icon: <IconR icon="businessMan" size={18} /> },
        { path: "/admin/contract", label: t('navMenu.customersContract'), icon: <IconR icon="FcReading" size={18} /> },
        { path: "/admin/oldraport", label: t('navMenu.raportOld'), icon: <IconR icon="businessContact" size={18} /> },
        { path: "/admin/newraport", label: t('navMenu.raportNew'), icon: <IconR icon="FcBearish" size={18} /> },
        { path: "/admin/CreateConsultant", label: t('navMenu.customersCreate'), icon: <IconR icon="FcOvertime" size={18} /> },

    ];
    return (
        <aside className='w-full py-2 p-4 h-full border border-t-0 border-b-0'>
            <div className='flex flex-col justify-between h-96'>
                <img className='text-center mt-10 mx-auto' alt="img" />
                <nav>
                    <ul className='flex flex-col space-y-3 text-md font-bold capitalize'>
                        {links.map((link, index) => (
                            <li key={index} className='flex flex-row space-x-2 items-start justify-start'>
                                {link.icon}
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default AsideMenu;
