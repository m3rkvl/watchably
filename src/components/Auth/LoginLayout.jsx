import React from "react";
import { useSelector } from "react-redux";
import LoginForm from "./Login/LoginForm";
import classes from "./LoginLayout.module.scss";

const LoginLayout = () => {
  const isLoggingIn = useSelector((state) => state.ui.isLoggingIn);
  const header = isLoggingIn
    ? "Log in to your account."
    : "Reset your password.";
  const description = isLoggingIn
    ? "In order to be able to search, list, or save movies or series, you should login."
    : "Let us send you a password reset email. Follow the link in the email we'll send.";

  return (
    <div className={classes.loginContainer}>
      <h2 className={classes.loginHeader}>{header}</h2>
      <p className={classes.loginDescription}>{description}</p>
      <LoginForm />
    </div>
  );
};

export default LoginLayout;
