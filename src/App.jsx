// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import UserDataPage from "./components/UserData/UserData";

import { useEffect, useState } from "react";
import { checkAuthStatus } from "./services/authService"; // Import the checkAuthStatus function

const App = () => {
  const [user, setUser] = useState(null); // Initialize user state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Check authentication status and update user state
    const unsubscribe = checkAuthStatus((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);
  return (
    <>
      {loading ? (
        // Show loader while checking authentication status
        <div>Loading...</div>
      ) : (
        <Router>
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
              path="/user-data"
              element={user ? <UserDataPage /> : <Navigate to="/login" />}
            />
            {/* Redirect to login if not authenticated */}
            <Route
              path="/*"
              element={
                user ? <Navigate to="/user-data" /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
