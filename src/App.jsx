import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/HomePage';
import HeaderUser from "./components/HeaderUser"
import LoginPage from './components/LoginPage/LoginPage';
import UserSite from './components/UserData/CustomersPage';
import UserContract from './components/UserData/ContractPage';
import AsideMenu from './components/AsideMenu';

import { checkAuthStatus } from './services/Hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = checkAuthStatus((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe?.();
  }, []);

  // Layout component that includes the AsideMenu and a section for children components
  const Layout = ({ children }) => {
    return (
      <div className="flex">
        <AsideMenu />
        <ToastContainer />
        <main className="flex-grow">
          <HeaderUser />
          <section className="p-6 xl:max-w-5xl xl:mx-auto">
            {children}
          </section>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />}
          />
          <Route
            path="/customers"
            element={user ? <UserSite /> : <Navigate to="/login" />}
          />
          <Route
            path="/contractUsers"
            element={user ? <UserContract /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>

    </Router>
  );
};

export default App;
