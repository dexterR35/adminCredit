// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import UserDataPage from "./components/UserData/UserData";
import { checkAuthStatus } from "./services/authService";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status when the component mounts
    checkAuthStatus(setUser);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          {user ? (
            <Route path="/user-data" element={<UserDataPage />} />
          ) : (
            // Redirect to the login page if not authenticated
            <Route path="/*" element={<LoginPage setUser={setUser} />} />
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
