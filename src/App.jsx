import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/../HomePage'; // Corrected import path
import HeaderUser from './components/HeaderUser';
import UserSite from './pages/Customers/CustomersPage'; // Corrected import path
import ContractPage from './pages/Contract/ContractPage'; // Corrected import path
import AsideMenu from './components/Layout/AsideMenu';
import AsideContent from './components/Layout/AsideContent';
import FormUser from './pages/Deadline/DeadlinePage'; // Corrected import path
import LoginPage from './pages/Auth/LoginPage'; // Corrected import path
import { checkAuthStatus } from './hooks/useAuth';
import FetchCSVData from './pages/FetchCsv/FetchCsvPage'; // Corrected import path
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
      <div className='grid grid-cols-3'>
        <HeaderUser />
        <div className="grid grid-cols-3">
          <AsideMenu />
          <main className="mt-4 col-span-2 p-4">
            {children}
          </main>
          <AsideContent />
        </div>
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
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/admin/home" replace /> : <Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/admin/*" element={<ProtectedRoute>
          <Routes>
            <Route path="home" element={<HomePage user={user} />} />
            <Route path="customers" element={<UserSite />} />
            <Route path="contractUsers" element={<ContractPage />} />
            <Route path="services" element={<FormUser />} />
            <Route path="document" element={<FetchCSVData />} />
            <Route path="*" element={<Navigate to="/admin/home" replace />} />
          </Routes>
        </ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
