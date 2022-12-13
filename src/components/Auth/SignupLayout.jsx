import React from "react";
import SignupForm from "./Signup/SignupForm";
import classes from "./SignupLayout.module.scss";

const SignupLayout = () => {
  return (
    <div className={classes.signupContainer}>
      <h2 className={classes.signupHeader}>Sign up with your email.</h2>
      <p className={classes.signupDescription}>
        You need an account to be able to search, list, or save movies or
        series.
      </p>
      <SignupForm />
    </div>
  );
};

export default SignupLayout;
