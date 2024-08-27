import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import MainLayout from './Components/Layout/Layout';
import ContractTable from './Pages/ContractTable/ContractTable';
import ClientsWebPage from './Pages/ClientsWebPage/ClientsWebPage';
import FormUser from './Pages/Raports/AddUserRaport';
import LoginPage from './Pages/Auth/LoginPage';
// import FetchCSVData from './Pages/FetchCsv/FetchCsv';
import ConsultantPage from './Pages/Consultant/ConsultantPage';
import CreateConsultant from './Components/Consultant/CreateConsultant';
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
            {/* <Route path="customers" element={<CustomersPage />} /> */}
            <Route path="customers" element={<ClientsWebPage />} />
            <Route path="contract" element={<ContractTable />} />
            <Route path="newraport" element={<FormUser />} />
            {/* <Route path="oldraport" element={<FetchCSVData />} /> */}
            <Route path="CreateConsultant" element={<CreateConsultant />} />
            <Route path="consultant" element={<ConsultantPage />} />
            <Route path="*" element={<Navigate to="/admin/home" replace />} />
          </Routes>
        </ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
