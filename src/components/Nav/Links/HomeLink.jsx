import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../img/logo-gradient.webp";
import classes from "./HomeLink.module.scss";

const HomeLink = () => {
  return (
    <Link
      aria-label={`navigate to "/discover" page`}
      className={classes.homeLink}
      to="/"
    >
      <img className={classes.logo} src={Logo} alt="Watchably logo" />
    </Link>
  );
};

export default HomeLink;
