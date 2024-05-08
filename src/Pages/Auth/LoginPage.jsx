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
    } finally {
      setSubmitting(false);  // Ensure to set submitting to false after processing is complete
    }
  }

  const fields = [
    {
      name: "email",
      label: "",
      as: "input",
      value: loginValues.email,
      onChange: handleChange,
      placeholder: "Email",
    },
    {
      name: "password",
      label: "",
      placeholder: "Password",
      as: "input",
      value: loginValues.password,
      onChange: handleChange,
    }
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h3 className='my-4 p-0 uppercase font-semibold'>Obtine Credit</h3>
      <FormInput
        initialValues={loginValues}
        onSubmit={handleLogin}
        fields={fields}
        customClass="grid grid-cols-1 gap-4 items-center w-full"
        submitButtonText="Login"
      />

    </div>
  );
};

export default LoginPage;
