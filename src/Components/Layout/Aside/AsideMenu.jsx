import IconR from "../../utils/_Icon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { Button } from "../../Buttons";
import { Logout } from "../../../services/Hooks";
import PropTypes from "prop-types";

const NAV_LINKS = [
  { path: "/home", label: "Dashboard", icon: "FcHome" },
  { path: "/customers", label: "Web Clients", icon: "businessMan" },
  { path: "/contract", label: "Contracts", icon: "FcReading" },
  { path: "/newraport", label: "Fisa Clientului", icon: "FcBearish" },
];

function AsideMenu({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Could not sign out.");
    }
  };

  return (
    <aside className={`dash-sidebar${isOpen ? " dash-sidebar--open" : ""}`}>
      <div className="dash-sidebar-brand">
        <div className="dash-sidebar-logo">OC</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-display font-bold text-gray-900">Obtine Credit</p>
          <p className="truncate text-xs text-gray-500">Admin Dashboard</p>
        </div>
        <button
          type="button"
          className="dash-sidebar-close lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <IoClose className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="dash-sidebar-nav">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Navigation
        </p>
        <ul className="space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={handleNavClick}
                  className={`dash-nav-link ${isActive ? "dash-nav-link--active" : ""}`}
                >
                  <span className="dash-nav-icon">
                    <IconR icon={link.icon} />
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-4">
        <Button
          text="Logout"
          variant="ghost"
          icon="IoLogout"
          onClick={handleLogout}
          fullWidth
          size="sm"
        />
      </div>
    </aside>
  );
}

AsideMenu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AsideMenu;
