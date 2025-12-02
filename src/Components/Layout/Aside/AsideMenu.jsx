import IconR from "../../utils/_Icon"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from "../../Buttons/Buttons";
import { Logout } from "../../../services/Hooks";

function AsideMenu() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await Logout();
            // Don't reload - the auth state listener will handle navigation
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    
    const links = [
        { path: "/home", label: "Home", icon: <IconR icon="FcHome" /> },
        { path: "/customers", label: "Web Clients", icon: <IconR icon="businessMan" /> },
        { path: "/contract", label: "Contracts", icon: <IconR icon="FcReading" /> },
        { path: "/newraport", label: "New Report", icon: <IconR icon="FcBearish" /> },
    ];
    
    return (
        <div className='w-full h-full flex flex-col p-4'>
            {/* Navigation Links */}
            <nav className="flex-1 pt-4">
                <ul className='flex flex-col space-y-1'>
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <li key={index}>
                                <Link 
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                        isActive 
                                            ? 'bg-indigo-600/90 text-white' 
                                            : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50'
                                    }`}
                                >
                                    <span className="text-xl">
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
            <div className="pt-4 pb-4 border-t border-slate-700/50">
                <CustomButton 
                    text='Logout' 
                    buttonType="logOut" 
                    onClick={handleLogout}
                    additionalClasses="w-full justify-center text-sm" 
                />
            </div>
        </div>
    );
}

export default AsideMenu;
