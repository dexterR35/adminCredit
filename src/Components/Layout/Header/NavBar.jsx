import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineBars3,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAuth } from "../../../context/AuthContext";
import { Logout } from "../../../services/Hooks";
import { getBreadcrumbs } from "../navConfig";
import PageBreadcrumb from "./PageBreadcrumb";
import PropTypes from "prop-types";

const NavBar = ({ onMenuToggle }) => {
  const { isAdmin, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const crumbs = getBreadcrumbs(location.pathname);

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const roleLabel = isAdmin ? "Administrator" : "Consultant";
  const initials =
    user?.username?.slice(0, 2)?.toUpperCase() ||
    user?.email?.slice(0, 2)?.toUpperCase() ||
    "U";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, closeMenu]);

  const handleLogout = async () => {
    closeMenu();
    try {
      await Logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Could not sign out.");
    }
  };

  return (
    <div className="dash-header-inner">
      <div className="dash-header-start">
        <button
          type="button"
          className="dash-mobile-menu-btn lg:hidden"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <HiOutlineBars3 className="h-5 w-5" aria-hidden />
        </button>

        <PageBreadcrumb crumbs={crumbs} />
      </div>

      <div className="dash-header-end" ref={menuRef}>
        <button
          type="button"
          className="dash-header-user-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-label="Account menu"
        >
          <span className="dash-user-avatar">{initials}</span>
          <span className="hidden min-w-0 md:block">
            <span className="block truncate text-sm font-semibold capitalize text-gray-900">
              {displayName}
            </span>
            <span className="block truncate text-xs text-gray-500">{roleLabel}</span>
          </span>
          <HiOutlineChevronDown
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {menuOpen && (
          <div
            className="dash-header-user-menu"
            role="menu"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="dash-user-avatar dash-user-avatar--lg">{initials}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold capitalize text-gray-900">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  <p className="mt-1 text-xs font-medium text-primary-700">{roleLabel}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              onClick={handleLogout}
            >
              <HiOutlineArrowRightOnRectangle className="h-4 w-4 text-gray-500" aria-hidden />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

NavBar.propTypes = {
  onMenuToggle: PropTypes.func,
};

export default NavBar;
