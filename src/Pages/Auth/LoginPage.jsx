import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../services/Hooks';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to handle errors

  const handleLogin = async () => {
    try {
      const authUser = await Login(); // No email and password needed for Google Sign-In
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      navigate("/admin/home");
    } catch (error) {
      console.error("Login error:", error.message);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h3 className='my-2 p-0 uppercase font-semibold'>Obtine Credit</h3>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if error state is set */}
      
      <button 
        onClick={handleLogin}
        className="w-[280px] bg-red-500 text-white font-semibold border-0 outline-0 uppercase py-2"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;


