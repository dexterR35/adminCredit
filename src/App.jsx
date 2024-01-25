// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import UserDataPage from "./components/UserData/UserData";
import { checkAuthStatus } from "./services/authService";
import LoaderPage from "./components/LoadingPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status and update user state
    const unsubscribe = checkAuthStatus((authUser) => {
      setUser(authUser);
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
      <Router>
        {/* {user && <LoaderPage />}{" "} */}
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

          <Route
            path="/*"
            element={
              user ? <Navigate to="/user-data" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
