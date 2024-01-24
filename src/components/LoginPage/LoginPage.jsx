// src/components/LoginPage/LoginPage.jsx
import { useState, useEffect } from "react";
import { checkAuthStatus, login } from "../../services/authService";
import { fetchCustomerData } from "../../services/firestoreService";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const testEmail = "florin@gmail.com";
  const testPassword = "123456";

  useEffect(() => {
    // Check if the user is already authenticated (based on the token)

    const idToken = localStorage.getItem("idToken");

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

      const authMethod = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        authMethod,
        testEmail,
        testPassword
      );

      // Once authenticated, fetch data from Firestore
      await fetchCustomerData();

      // Obtain the ID token from the authenticated user
      const idToken = await userCredential.user.getIdToken();

      console.log("ID Token:", idToken);

      // Update the user state in the App component
      setUser(userCredential.user);

      navigate("/user-data");
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error.message);
    }
  };
  return (
    <div className="container w-full h-screen flex items-center justify-center flex-col">
      <div className="bg-white w-[50%] h-[300px] flex flex-col justify-center items-center font-sans">
        <p className="text-md uppercase font-bold">ObtineCredit.ro</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-[50%] my-4 p-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-[50%] p-2 rounded-md"
        />

        <button
          onClick={handleLogin}
          className="btn w-1/3 bg-red-500 rounded mx-auto my-4 p-2 text-white"
        >
          Login
        </button>
        <a href="#" className="font-sm">
          reseteaza parola
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
