import IconR from "../../utils/_Icon"
import { Link } from 'react-router-dom';
import useTranslate from '../../../services/useTranslate';
import { CustomButton } from "../../Buttons/Buttons";

function AsideMenu() {
    const { t } = useTranslate();
    const links = [
        { path: "/admin/home", label: t('navMenu.home'), icon: <IconR icon="FcHome" /> },
        { path: "/admin/customers", label: t('navMenu.clientsSite'), icon: <IconR icon="businessMan" /> },
        { path: "/admin/contract", label: t('navMenu.clientsContract'), icon: <IconR icon="FcReading" /> },
        { path: "/admin/oldraport", label: t('navMenu.raportOld'), icon: <IconR icon="businessContact" /> },
        { path: "/admin/newraport", label: t('navMenu.raportNew'), icon: <IconR icon="FcBearish" /> },
    ];
    return (
        <aside className='w-full px-4 h-full border border-t-0 border-b-0'>
            <div className='grid grid-rows-2 justify-between h-[90%]'>
                <nav className="self-center">
                    <ul className='flex flex-col space-y-2 font-bold capitalize'>
                        {links.map((link, index) => (
                            <li key={index} className='flex flex-row space-x-2 items-start justify-start'>
                                {link.icon}
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="self-end">
                    <CustomButton text='button.logout' buttonType="logOut" additionalClasses="text-sm" />
                </div>
            </div>
        </aside>
    );
}

export default AsideMenu;
