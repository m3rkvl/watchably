import React, { Fragment } from "react";
import HomeLink from "./Links/HomeLink";
import classes from "./nav.module.scss";
import NavBtn from "./Links/NavBtn";
import NavBtnInner from "./Links/NavBtnInner";
import LogOutBtn from "../Auth/LogOut/LogOutBtn";
import { UserAuth } from "../../context/AuthContext";

const Nav = () => {
  const { user } = UserAuth();

  // console.log(user);

  return (
    <Fragment>
      <nav className={classes.nav}>
        <div className={classes.leftButtons}>
          {user && user !== "loading..." && <NavBtn role="search" />}
          {user && user !== "loading..." && <NavBtnInner role="discover" />}
        </div>
        <HomeLink />
        <div className={classes.rightButtons}>
          {user && user !== "loading..." && <NavBtnInner role="me" />}
          {user && user !== "loading..." && <NavBtn role="library" />}
        </div>
      </nav>
    </Fragment>
  );
};

export default Nav;
