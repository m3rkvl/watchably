import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LogOutBtn from "../components/Auth/LogOut/LogOutBtn";
import { UserAuth } from "../context/AuthContext";
import UserIcon from "../icons/UserIcon";

import classes from "./MePage.module.scss";

const MePage = () => {
  const navigate = useNavigate();
  //prettier-ignore
  const { user, updateUserProfile, updateUserEmail, updateUserPassword } = UserAuth();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });

  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  document.title = `Watchably • Account`;

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {};
      // better validation
      if (username.length > 3) {
        data.displayName = username;
      }
      await updateUserProfile(data);
      setUsername("");
    } catch (err) {
      console.log(err.message);
    }
  };
  const updateEmailHandler = (e) => {
    e.preventDefault();
    setChangingEmail((prev) => true);
    setShowModal(true);
  };
  const updatePasswordHandler = (e) => {
    e.preventDefault();
    setChangingPassword((prev) => true);
    setShowModal(true);
  };
  const reAuthHandler = async (e) => {
    e.preventDefault();
    try {
      if (changingEmail) {
        await updateUserEmail(email, currentPassword);
        setEmail("");
        setCurrentPassword("");
        setChangingEmail(false);
        setShowModal(false);
      }

      if (changingPassword) {
        await updateUserPassword(password, currentPassword);
        setPassword("");
        setCurrentPassword("");
        setChangingPassword(false);
        setShowModal(false);
      }
    } catch (err) {
      setChangingPassword(false);
      setChangingEmail(false);
      console.log(err.message);
    }
  };

  const closeModalHandler = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <div className={classes.container}>
      <div
        className={`${classes.reAuthModal} ${
          showModal ? classes.modalVisible : ""
        }`}
      >
        <div className={classes.reAuth}>
          <form
            className={`${classes.form} ${classes.emailForm}`}
            onSubmit={reAuthHandler}
          >
            <p className={classes.modalTitle}>
              We need your current password for this.
            </p>
            <div className={classes.fieldHolder}>
              <input
                id="reAuth"
                className={classes.input}
                placeholder=" "
                type="password"
                autoComplete="off"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
              />
              <label className={classes.label} htmlFor="reAuth">
                Current Password
              </label>
            </div>
            <div className={classes.modalActions}>
              <button
                type="submit"
                className={`${classes.btn} ${classes.submitBtn}`}
              >
                <span>Confirm</span>
              </button>
              <button
                type="button"
                className={`${classes.btn} ${classes.cancelBtn}`}
                onClick={closeModalHandler}
              >
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.header}>
        <div className={classes.userInfo}>
          {user && user !== "loading..." && (
            <div className={classes.userIcon}>
              <UserIcon />
            </div>
          )}
          {user && user !== "loading..." && user.displayName && (
            <p className={classes.name}>{user.displayName}</p>
          )}
          {user && user !== "loading..." && (
            <p
              className={user.displayName ? classes.email : classes.emailAlone}
            >
              {user.email}
            </p>
          )}
          <LogOutBtn />
        </div>
        <div className={classes.updateProfile}>
          <p className={classes.formTitle}>Want to update your profile?</p>
          <form className={classes.form} onSubmit={updateProfileHandler}>
            <div className={classes.fieldHolder}>
              <input
                id="updateName"
                className={classes.input}
                placeholder=" "
                type="text"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <label className={classes.label} htmlFor="updateName">
                Username
              </label>
            </div>
            <button
              type="submit"
              className={`${classes.btn} ${classes.submitBtn}`}
            >
              <span>Update</span>
            </button>
          </form>
        </div>
      </div>
      <div className={classes.authForms}>
        <div className={classes.updateEmail}>
          <p className={classes.formTitle}>Want to update your email?</p>
          <form
            className={`${classes.form} ${classes.emailForm}`}
            onSubmit={updateEmailHandler}
          >
            <div className={classes.fieldHolder}>
              <input
                id="updateEmail"
                className={classes.input}
                placeholder=" "
                type="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <label className={classes.label} htmlFor="updateEmail">
                Email
              </label>
            </div>
            <button
              type="submit"
              className={`${classes.btn} ${classes.submitBtn}`}
            >
              <span>Update</span>
            </button>
          </form>
        </div>
        <div className={classes.updatePassword}>
          <form
            className={`${classes.form} ${classes.emailForm}`}
            onSubmit={updatePasswordHandler}
          >
            <p className={classes.formTitle}>Want to update your password?</p>
            <div className={classes.fieldHolder}>
              <input
                id="updatePassword"
                className={classes.input}
                placeholder=" "
                type="password"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <label className={classes.label} htmlFor="updatePassword">
                Password
              </label>
            </div>
            <button
              type="submit"
              className={`${classes.btn} ${classes.submitBtn}`}
            >
              <span>Update</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MePage;

/*
          {user && user !== "loading..." && user.photoURL ? (
            <img
              className={classes.userPhoto}
              src={user.photoURL}
              alt="Your avatar."
            />
          ) : (
            <div className={classes.userIcon}>
              <UserIcon />
            </div>
          )}
*/
