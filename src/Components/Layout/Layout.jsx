import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ClientRemindersProvider } from "../../context/ClientRemindersContext";
import NavBar from "./Header/NavBar";
import AsideMenu from "./Aside/AsideMenu";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <ClientRemindersProvider>
    <div className="app-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <AsideMenu isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="app-main">
        <header className="app-header">
          <NavBar onMenuToggle={toggleSidebar} />
        </header>

        <main className="app-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
    </ClientRemindersProvider>
  );
};

export default MainLayout;
