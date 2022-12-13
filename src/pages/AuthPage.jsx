import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginLayout from "../components/Auth/LoginLayout";
import SignupLayout from "../components/Auth/SignupLayout";
import { UserAuth } from "../context/AuthContext";
import PanelsLayout from "../UI/PanelsLayout";

const AuthPage = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user !== "loading...") navigate("/search", { replace: true });
  });

  return (
    <PanelsLayout
      left={<LoginLayout />}
      right={<SignupLayout />}
      isAuthPage={true}
    />
  );
};

export default AuthPage;
