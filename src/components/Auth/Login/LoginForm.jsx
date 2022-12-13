import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./LoginForm.module.scss";
import { UserAuth } from "../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleIsLoggingIn } from "../../../store/ui-slice";

const LoginForm = () => {
  const isLoggingIn = useSelector((state) => state.ui.isLoggingIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);

  const navigate = useNavigate();

  const { signIn, resetPassword } = UserAuth();

  const loggingInHandler = () => {
    dispatch(toggleIsLoggingIn());
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      await signIn(email, password);
      navigate("/library");
    } catch (e) {
      setErr(e.message);
      console.log(e.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      await resetPassword(email);
      setEmail("");
      dispatch(toggleIsLoggingIn());
    } catch (e) {
      setErr(e.message);
      console.log(e.message);
    }
  };

  return (
    <Fragment>
      {err && <p>{err}</p>}
      {isLoggingIn && (
        <form className={classes.loginForm} onSubmit={handleSignIn}>
          <div className={classes.fieldHolder}>
            <input
              id="loginEmail"
              className={classes.loginInput}
              placeholder=" "
              type="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label className={classes.loginLabel} htmlFor="loginEmail">
              Email
            </label>
          </div>
          <div className={classes.fieldHolder}>
            <input
              id="loginPassword"
              className={classes.loginInput}
              placeholder=" "
              type="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className={classes.loginLabel} htmlFor="loginPassword">
              Password
            </label>
          </div>
          <div className={classes.actions}>
            <button
              type="submit"
              className={`${classes.btn} ${classes.submitBtn}`}
            >
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={loggingInHandler}
              className={`${classes.btn} ${classes.forgotBtn}`}
            >
              <span>Forgot Password?</span>
            </button>
          </div>
        </form>
      )}

      {!isLoggingIn && (
        <form onSubmit={handleReset} className={classes.loginForm}>
          <div className={classes.fieldHolder}>
            <input
              id="loginEmail"
              className={classes.loginInput}
              placeholder=" "
              type="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label className={classes.loginLabel} htmlFor="loginEmail">
              Email
            </label>
          </div>
          <div className={classes.actions}>
            <button
              type="submit"
              className={`${classes.btn} ${classes.submitBtn}`}
            >
              <span>Send</span>
            </button>
            <button
              type="button"
              onClick={loggingInHandler}
              className={`${classes.btn} ${classes.forgotBtn}`}
            >
              <span>Remember Password?</span>
            </button>
          </div>
        </form>
      )}
    </Fragment>
  );
};

export default LoginForm;

/*
<form className={classes.loginForm} onSubmit={handleSignIn}>
        <div className={classes.fieldHolder}>
          <input
            id="loginEmail"
            className={classes.loginInput}
            placeholder=" "
            type="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={classes.loginLabel} htmlFor="loginEmail">
            Email
          </label>
        </div>
        <div className={classes.fieldHolder}>
          <input
            id="loginPassword"
            className={classes.loginInput}
            placeholder=" "
            type="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={classes.loginLabel} htmlFor="loginPassword">
            Password
          </label>
        </div>
        <div className={classes.actions}>
          <button
            type="submit"
            className={`${classes.btn} ${classes.submitBtn}`}
          >
            <span>Login</span>
          </button>
          <button className={`${classes.btn} ${classes.forgotBtn}`}>
            <span>Forgot Password?</span>
          </button>
        </div>
      </form>
*/
