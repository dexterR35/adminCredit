// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import UserDataPage from "./components/UserData/UserData";
import { checkAuthStatus } from "./services/authService";
import { BrowserRouter } from "react-router-dom";
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
    <>
      {" "}
      <BrowserRouter>
        <ToastContainer />
        {/* {user && <LoaderPage />}{" "} */}
        <Routes>
          <Route
            path="/admin/login"
            element={
              user ? (
                <Navigate to="/admin/user-data" />
              ) : (
                <LoginPage setUser={setUser} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user ? (
                <Navigate to="/admin/user-data" /> // If user is logged in, redirect to user data within admin
              ) : (
                <Navigate to="/login" /> // If not logged in, redirect to login page
              )
            }
          />
          <Route
            path="/admin/user-data"
            element={
              user ? (
                <UserDataPage /> // Only show UserDataPage if user is logged in
              ) : (
                <Navigate to="/admin/login" /> // If not logged in, redirect to login page
              )
            }
          />

          <Route
            path="/*"
            element={<Navigate to="/admin/login" />} // Redirect all undefined routes to /admin
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
