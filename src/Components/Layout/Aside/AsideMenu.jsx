import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle, HiOutlineXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { Logout } from "../../../services/Hooks";
import { APP_NAME, NAV_ITEMS } from "../navConfig";
import PropTypes from "prop-types";

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
          <p className="truncate text-sm font-display font-bold text-gray-900">{APP_NAME}</p>
          <p className="truncate text-xs text-gray-500">Admin Dashboard</p>
        </div>
        <button
          type="button"
          className="dash-sidebar-close lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <HiOutlineXMark className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="dash-sidebar-nav" aria-label="Main navigation">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={handleNavClick}
                  className={`group dash-nav-link ${isActive ? "dash-nav-link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="dash-nav-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{link.label}</span>
                    <span className="mt-0.5 block truncate text-[11px] font-normal text-gray-400 group-hover:text-gray-500">
                      {link.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          className="dash-sidebar-logout"
          onClick={handleLogout}
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0" aria-hidden />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

AsideMenu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AsideMenu;
