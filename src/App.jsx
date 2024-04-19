import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import HeaderUser from "./components/Pages/HeaderUser";
import UserSite from './components/Pages/CustomersPage';
import ContractPage from './components/Pages/ContractPage';
import AsideMenu from './components/Pages/Aside/AsideMenu';
import AsideContent from './components/Pages/Aside/AsideContent';
import FormUser from './components/Pages/DeadlinePage'
import LoginPage from './components/LoginPage/LoginPage';
import { checkAuthStatus } from './services/Hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = checkAuthStatus((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  const Layout = ({ children }) => (
    <>
      <div className='grid grid-col-3'>
        <HeaderUser />
        <div className="grid grid-cols-custom">
          <AsideMenu />
          <main className="mt-10 p-4">
            {children}
          </main>
          <AsideContent />
        </div>
        {/* <HeaderUser /> */}
      </div>
    </>
  );

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return user ? <Layout>{children}</Layout> : <Navigate to="/admin/login" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/admin/home" replace /> : <Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/admin/*" element={<ProtectedRoute>
        <Routes>
          <Route path="home" element={<HomePage user={user} />} />
          <Route path="customers" element={<UserSite />} />
          <Route path="contractUsers" element={<ContractPage />} />
          <Route path="services" element={<FormUser />} />
          <Route path="*" element={<Navigate to="/admin/home" replace />} />
        </Routes>
      </ProtectedRoute>} />
    </Routes>
  );
};

export default App;
