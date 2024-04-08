import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import UserDataPage from './components/UserData/CustomersPage';
// import AboutUsPage from './components/AboutUsPage'; // Assuming you have an AboutUs component
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
          {/* Section with specified class names for styling */}
          <section className="p-6 xl:max-w-6xl xl:mx-auto">
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
            path="/user-data"
            element={user ? <UserDataPage /> : <Navigate to="/login" />}
          />
          {/* <Route
            path="/about"
            element={user ? <AboutUsPage /> : <Navigate to="/login" />}
          /> */}
          {/* Add more routes as needed */}
        </Routes>
      </Layout>

    </Router>
  );
};

export default App;
