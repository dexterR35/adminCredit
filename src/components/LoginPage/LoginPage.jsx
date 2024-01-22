// src/components/LoginPage/LoginPage.jsx
import { useState, useEffect } from "react";
import { checkAuthStatus, login } from "../../services/authService";
import { fetchCustomerData } from "../../services/firestoreService";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const testEmail = "florin@gmail.com";
  const testPassword = "123456";

  useEffect(() => {
    // Check if the user is already authenticated (based on the token)
    const idToken = localStorage.getItem("idToken");
    console.log(checkAuthStatus, "fas");
    if (idToken) {
      // Perform additional checks if necessary
      // ...

      // Navigate to the user data page
      navigate("/user-data");
    }
  }, [navigate]);
  const handleLogin = async () => {
    try {
      // Trim input values
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // Call authentication service
      const authenticatedUser = await login(testEmail, testPassword);

      // Once authenticated, fetch data from Firestore
      await fetchCustomerData();
      // Obtain the ID token from the authenticated user
      const idToken = await authenticatedUser.getIdToken();

      console.log("ID Token:", idToken);
      // Update the user state in the App component
      setUser(authenticatedUser);

      navigate("/user-data");
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
