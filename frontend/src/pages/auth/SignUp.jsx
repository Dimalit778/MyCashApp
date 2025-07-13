import React from "react";
import { toast } from "react-hot-toast";

import SignUpForm from "components/auth/SignUpForm";
import { useSignUpMutation } from "services/api/authApi";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleSignUp = async (formData) => {
    try {
      const res = await signUp(formData).unwrap();
      toast.success(res?.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />;
};

export default SignUp;
