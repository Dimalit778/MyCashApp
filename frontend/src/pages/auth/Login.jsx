import React from "react";
import { toast } from "react-hot-toast";

import LoginForm from "components/auth/LoginForm";
import { useLoginMutation } from "services/api/authApi";
const Login = () => {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (formData) => {
    try {
      await login(formData).unwrap();
    } catch (err) {
      console.log("err", err);
      toast.error(err?.data?.message);
    }
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />;
};

export default Login;
