// src/components/LoginPage/LoginPage.jsx
import { useState } from "react";
// import { fetchCustomerData } from "../../services/firestoreService";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      setLoading(true);
      // checkAuthStatus(setUser);
      const testEmail = "florin@gmail.com";
      const testPassword = "123456";
      // const trimmedEmail = email.trim();
      // const trimmedPassword = password.trim();
      const authMethod = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        authMethod,
        testEmail,
        testPassword
      );
      // Once authenticated, fetch data from Firestore
      // await fetchCustomerData();
      const authUser = userCredential.user;
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      navigate("/user-data");
    } catch (error) {
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container w-full h-screen flex items-center justify-center flex-col">
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
};

export default LoginPage;
