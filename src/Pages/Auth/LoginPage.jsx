import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../services/Hooks'; // Assuming this handles authentication

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(null); // State to handle errors

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }
      const authUser = await Login(username, password); // Pass username and password to the Login function
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      navigate("/admin/home");
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h3 className='my-2 p-0 uppercase font-semibold'>Login</h3>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="mb-2 p-2 border border-gray-300"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 border border-gray-300"
      />
      <button 
        onClick={handleLogin}
        className="w-[280px] bg-red-500 text-white font-semibold border-0 outline-0 uppercase py-2"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
