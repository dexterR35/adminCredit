// src/components/LoginPage/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../services/Hooks";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const testEmail = email.trim();
      const testPassword = password.trim();
      const authUser = await Login(testEmail, testPassword);
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  return (
    <div className="container mx-auto w-full h-screen flex items-center justify-center flex-col">
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
          className="btn w-1/3 bg-red-500 rounded mx-auto my-4 p-2 text-white uppercase"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
