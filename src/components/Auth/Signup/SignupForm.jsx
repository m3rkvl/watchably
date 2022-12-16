import React, { Fragment, useState } from "react";
// import { Link } from "react-router-dom";
import classes from "./SignupForm.module.scss";
import { UserAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router";
import ShowIcon from "../../../icons/ShowIcon";
import UnShowIcon from "../../../icons/UnShowIcon";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState(false);
  const [showPasswordCon, setShowPasswordCon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [passConErr, setPassConErr] = useState(false);

  const navigate = useNavigate();

  const { signUp } = UserAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      if (
        (email.trim() === "") |
        (password.trim() === "") |
        (passwordConfirm.trim() === "")
      ) {
        if (email.trim() === "") setEmailErr(true);
        if (password.trim() === "") setPassErr(true);
        if (passwordConfirm.trim() === "") setPassConErr(true);
        throw new Error("Must fill all the fields.");
      }
      if (!email.trim().includes("@") || !email.trim().includes(".")) {
        setEmailErr(true);
        throw new Error("Please provide a valid email.");
      }
      if (password.length < 6) {
        setPassErr(true);
        throw new Error("Password must be at least 6 characters.");
      }
      if (password !== passwordConfirm) {
        setPassErr(true);
        setPassConErr(true);
        throw new Error("Your passwords must match.");
      }
      await signUp(email, password);
      navigate("/search", { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  };

  const emailChangeHandler = (e) => {
    setEmail((prev) => e.target.value);
    setEmailErr(false);
  };

  const passChangeHandler = (e) => {
    setPassword((prev) => e.target.value);
    setPassErr(false);
  };

  const passConChangeHandler = (e) => {
    setPasswordConfirm((prev) => e.target.value);
    setPassConErr(false);
  };

  const showPasswordConHandler = () => {
    setShowPasswordCon((prev) => !prev);
  };

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Fragment>
      <form className={classes.signupForm} onSubmit={handleSignUp}>
        {(emailErr || passErr || passConErr) && (
          <p className={classes.error}>{err}</p>
        )}
        <div className={classes.fieldHolder}>
          <input
            id="signupEmail"
            className={`${classes.signupInput} ${
              emailErr ? classes.invalid : ""
            }`}
            placeholder=" "
            type="email"
            autoComplete="off"
            onChange={emailChangeHandler}
          />
          <label className={classes.signupLabel} htmlFor="signupEmail">
            Email
          </label>
        </div>
        <div className={classes.fieldHolder}>
          <div onClick={showPasswordHandler} className={classes.showPassBtn}>
            {showPassword ? <UnShowIcon /> : <ShowIcon />}
          </div>
          <input
            id="signupPassword"
            className={`${classes.signupInput} ${
              passErr ? classes.invalid : ""
            }`}
            placeholder=" "
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            onChange={passChangeHandler}
          />
          <label className={classes.signupLabel} htmlFor="signupPassword">
            Password
          </label>
        </div>
        <div className={classes.fieldHolder}>
          <div onClick={showPasswordConHandler} className={classes.showPassBtn}>
            {showPasswordCon ? <UnShowIcon /> : <ShowIcon />}
          </div>
          <input
            id="signupPasswordConfirm"
            className={`${classes.signupInput} ${
              passConErr ? classes.invalid : ""
            }`}
            placeholder=" "
            type={showPasswordCon ? "text" : "password"}
            autoComplete="off"
            onChange={passConChangeHandler}
          />
          <label
            className={classes.signupLabel}
            htmlFor="signupPasswordConfirm"
          >
            Confirm Password
          </label>
        </div>
        <div className={classes.actions}>
          <button
            type="submit"
            className={`${classes.btn} ${classes.submitBtn}`}
          >
            <span>Sign up</span>
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default SignupForm;
