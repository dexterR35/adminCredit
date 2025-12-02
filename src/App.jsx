import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import MainLayout from './Components/Layout/Layout';
import ContractTable from './Pages/ContractTable/ContractTable';
import ClientsWebPage from './Pages/ClientsWebPage/ClientsWebPage';
import FormUser from './Pages/Raports/AddUserRaport';
import LoginPage from './Pages/Auth/LoginPage';
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
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // ProtectedRoute: All admin routes require authentication
  // If user is not authenticated, redirect to /login
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading...</p>
        </div>
      </div>;
    }
    // All admin routes are protected - require authentication
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <MainLayout>{children}</MainLayout>;
  };

  // Public route wrapper that redirects logged-in users away from login page
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading...</p>
        </div>
      </div>;
    }
    // If user is logged in, redirect to home instead of showing login page
    return user ? <Navigate to="/home" replace /> : children;
  };

  return (
    <>
      <Routes>
        {/* Root route: redirect to /home if authenticated, otherwise to /login */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        
        {/* Login route: public, but redirects to /home if already logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage setUser={setUser} /></PublicRoute>} />
        
        {/* All other routes are protected admin routes - require authentication */}
        <Route path="/*" element={<ProtectedRoute>
          <Routes>
            <Route path="home" element={<HomePage user={user} />} />
            <Route path="customers" element={<ClientsWebPage />} />
            <Route path="contract" element={<ContractTable />} />
            <Route path="newraport" element={<FormUser />} />
            <Route path="CreateConsultant" element={<CreateConsultant />} />
            <Route path="consultant" element={<ConsultantPage />} />
            {/* Catch-all: redirect unknown routes to /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
