import React, { Fragment, useState } from "react";
// import { Link } from "react-router-dom";
import classes from "./SignupForm.module.scss";
import { UserAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState(false);

  const navigate = useNavigate();

  const { signUp } = UserAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      if (password !== passwordConfirm)
        throw new Error("Your passwords must match.");
      await signUp(email, password);
      navigate("/search", { replace: true });
    } catch (e) {
      setErr(e.message);
      console.log(e.message);
    }
  };

  return (
    <Fragment>
      {err && <p>{err}</p>}
      <form className={classes.signupForm} onSubmit={handleSignUp}>
        <div className={classes.fieldHolder}>
          <input
            id="signupEmail"
            className={classes.signupInput}
            placeholder=" "
            type="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={classes.signupLabel} htmlFor="signupEmail">
            Email
          </label>
        </div>
        <div className={classes.fieldHolder}>
          <input
            id="signupPassword"
            className={classes.signupInput}
            placeholder=" "
            type="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={classes.signupLabel} htmlFor="signupPassword">
            Password
          </label>
        </div>
        <div className={classes.fieldHolder}>
          <input
            id="signupPasswordConfirm"
            className={classes.signupInput}
            placeholder=" "
            type="password"
            autoComplete="off"
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
          {/* <Link to="/auth" className={`${classes.btn} ${classes.forgotBtn}`}>
            <span>Forgot Password?</span>
          </Link> */}
        </div>
      </form>
    </Fragment>
  );
};

export default SignupForm;
