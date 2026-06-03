import { useState } from "react";
import NavBar from "./Header/NavBar";
import AsideMenu from "./Aside/AsideMenu";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="dash-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="dash-sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <AsideMenu isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="dash-main">
        <header className="dash-header">
          <NavBar onMenuToggle={toggleSidebar} />
        </header>

        <main className="dash-content animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
