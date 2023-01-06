import React, { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./LoginForm.module.scss";
import { UserAuth } from "../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleIsLoggingIn } from "../../../store/ui-slice";
import ShowIcon from "../../../icons/ShowIcon";
import UnShowIcon from "../../../icons/UnShowIcon";

const LoginForm = () => {
  const isLoggingIn = useSelector((state) => state.ui.isLoggingIn);
  const dispatch = useDispatch();
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const email = useRef();
  const password = useRef();

  const navigate = useNavigate();

  const { signIn, resetPassword } = UserAuth();

  const loggingInHandler = () => {
    dispatch(toggleIsLoggingIn());
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      await signIn(email.current.value, password.current.value);
      navigate("/library");
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleDemoSignIn = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      await signIn("demo-user@outlook.com", "demo-user1234");
      navigate("/library");
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      await resetPassword(email.current.value);
      dispatch(toggleIsLoggingIn());
    } catch (e) {
      setErr(e.message);
    }
  };

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
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
              ref={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            <label className={classes.loginLabel} htmlFor="loginEmail">
              Email
            </label>
          </div>
          <div className={classes.fieldHolder}>
            <div onClick={showPasswordHandler} className={classes.showPassBtn}>
              {showPassword ? <UnShowIcon /> : <ShowIcon />}
            </div>
            <input
              id="loginPassword"
              className={classes.loginInput}
              placeholder=" "
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              ref={password}
              // onChange={(e) => setPassword(e.target.value)}
            />
            <label className={classes.loginLabel} htmlFor="loginPassword">
              Password
            </label>
          </div>
          <div className={classes.actionsContainer}>
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
            <button
              type="button"
              onClick={(e) => {
                handleDemoSignIn(e);
              }}
              className={`${classes.btn} ${classes.demoBtn}`}
            >
              <span>Demo User</span>
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
              // onChange={(e) => setEmail(e.target.value)}
              ref={email}
              // value={email}
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
