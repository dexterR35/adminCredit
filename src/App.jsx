import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import UserDataPage from "./components/UserData/UserData";
import { checkAuthStatus } from "./services/authService";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // This imports default styling
// import LoaderPage from "./components/LoadingPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status and update user state
    const unsubscribe = checkAuthStatus((authUser) => {
      setUser(authUser);
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe?.();
  }, []);

  return (
    <Router>
      <ToastContainer />
      {/* {user && <LoaderPage />} */}
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/user-data" />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user ? (
              <Navigate to="/user-data" /> // If user is logged in, redirect to user data within admin
            ) : (
              <Navigate to="/login" /> // Corrected Redirect to login page within admin
            )
          }
        />
        <Route
          path="/user-data"
          element={
            user ? (
              <UserDataPage /> // Only show UserDataPage if user is logged in
            ) : (
              <Navigate to="/login" /> // If not logged in, redirect to login page within admin
            )
          }
        />

        <Route
          path="/*"
          element={<Navigate to="/login" />} // Redirect all undefined routes to admin login
        />
      </Routes>
    </Router>
  );
};

export default App;
