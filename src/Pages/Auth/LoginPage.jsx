// src/components/LoginPage/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../services/Hooks";
import { LogInButton } from "../../Components/Buttons/Buttons"
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
      navigate("/admin/home");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  return (
    <div className=" w-full h-screen flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center p-4">
        <p className="text-lg uppercase font-bold mb-4">Obtine Credit.ro</p>
        <div className="flex-col flex md:w-80 w-[100%]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          <div className="flex justify-between mt-2 text-[12px]">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <p className="underline text-gray-700 cursor-pointer">Forgot Password?</p>
          </div>
        </div>

        <LogInButton onClick={handleLogin} size='lg' additionalClasses="w-full mt-6" />

      </div>
    </div >
  );
};

export default LoginPage;
