import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage'; // Corrected import path
import MainLayout from './Components/Layout/Layout';
import CustomersPage from './Pages/Customers/CustomersPage'; // Corrected import path
import ContractPage from './Pages/Contract/ContractPage'; // Corrected import path
import FormUser from './Pages/Extra/CustomersOffice'; // Corrected import path
import LoginPage from './Pages/Auth/LoginPage'; // Corrected import path
import FetchCSVData from './Pages/FetchCsv/FetchCsv'; // Corrected import path

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

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/admin/login" replace />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/admin/home" replace /> : <Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/admin/*" element={<ProtectedRoute>
          <Routes>
            <Route path="home" element={<HomePage user={user} />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="contractUserssss" element={<ContractPage />} />
            <Route path="createUser" element={<FormUser />} />
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
