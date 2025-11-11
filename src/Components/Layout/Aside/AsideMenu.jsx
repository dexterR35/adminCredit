import IconR from "../../utils/_Icon"
import { Link, useLocation } from 'react-router-dom';
import useTranslate from '../../../services/useTranslate';
import { CustomButton } from "../../Buttons/Buttons";

function AsideMenu() {
    const { t } = useTranslate();
    const location = useLocation();
    
    const links = [
        { path: "/admin/home", label: t('navMenu.home'), icon: <IconR icon="FcHome" /> },
        { path: "/admin/customers", label: t('navMenu.clientsSite'), icon: <IconR icon="businessMan" /> },
        { path: "/admin/contract", label: t('navMenu.clientsContract'), icon: <IconR icon="FcReading" /> },
        { path: "/admin/oldraport", label: t('navMenu.raportOld'), icon: <IconR icon="businessContact" /> },
        { path: "/admin/newraport", label: t('navMenu.raportNew'), icon: <IconR icon="FcBearish" /> },
    ];
    
    return (
        <div className='w-full h-full flex flex-col p-4'>
            {/* Navigation Links */}
            <nav className="flex-1 pt-6">
                <ul className='flex flex-col space-y-1'>
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <li key={index}>
                                <Link 
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                                            : 'text-gray-300'
                                    }`}
                                >
                                    <span className="text-lg">
                                        {link.icon}
                                    </span>
                                    <span className="capitalize">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            
            {/* Logout Button */}
            <div className="pt-4 pb-6 border-t border-gray-700">
                <CustomButton 
                    text='button.logout' 
                    buttonType="logOut" 
                    additionalClasses="w-full justify-center shadow-sm bg-gray-700 text-white border-gray-600" 
                />
            </div>
        </div>
    );
}

export default AsideMenu;
