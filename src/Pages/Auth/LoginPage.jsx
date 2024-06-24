import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../services/Hooks';
import FormInput from '../../Components/Form/FormInput';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null); // State to handle errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const { email, password } = values;
      const authUser = await Login(email.trim(), password.trim());
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      navigate("/admin/home");
    } catch (error) {
      console.error("Login error:", error.message);
      setError("An error occurred. Please try again."); 
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    {
      name: "email",
      label: "",
      as: "input",
      value: loginValues.email,
      onChange: handleChange,
      placeholder: "Email",
      inputClass: ""
    },
    {
      name: "password",
      label: "",
      placeholder: "Password",
      as: "input",
      value: loginValues.password,
      onChange: handleChange,
      inputClass: "mb-4"
    }
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h3 className='my-2 p-0 uppercase font-semibold'>Obtine Credit</h3>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if error state is set */}
      <FormInput
        initialValues={loginValues}
        onSubmit={handleLogin}
        fields={fields}
        formCustomClass="flex flex-col items-center gap-2 order-1 w-[280px]"
        buttonCustomClass="w-full bg-red-500 text-white font-semibold border-0 outline-0 uppercase"
        submitButtonText="Login"
      />
    </div>
  );
};

export default LoginPage;
