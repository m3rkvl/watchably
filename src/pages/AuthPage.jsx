import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginLayout from "../components/Auth/LoginLayout";
import SignupLayout from "../components/Auth/SignupLayout";
import { UserAuth } from "../context/AuthContext";
import PanelsLayout from "../UI/PanelsLayout";
import { useMediaQuery } from "react-responsive";
import OnePanel from "../components/Auth/OnePanel";

const AuthPage = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user !== "loading...") navigate("/search", { replace: true });
  });

  const onePanel = useMediaQuery({
    query: "(max-width: 60.3125rem)",
  });

  console.log(onePanel);

  document.title = `Watchably • Welcome!`;

  let rtrn;

  if (!onePanel) {
    rtrn = (
      <PanelsLayout
        left={<LoginLayout />}
        right={<SignupLayout />}
        isAuthPage={true}
      />
    );
  }

  if (onePanel) {
    rtrn = <OnePanel />;
  }

  return rtrn;
};

export default AuthPage;
