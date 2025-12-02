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
            navigate("/login");
            window.location.reload(); // Force reload to clear all state
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
                                            ? 'bg-indigo-600 text-white shadow-md' 
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
                    text='Logout' 
                    buttonType="logOut" 
                    onClick={handleLogout}
                    additionalClasses="w-full justify-center shadow-sm bg-gray-700 text-white border-gray-600" 
                />
            </div>
        </div>
    );
}

export default AsideMenu;
