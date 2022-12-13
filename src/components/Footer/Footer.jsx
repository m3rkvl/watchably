import React from "react";
import tmdbLogo from "../../img/tmbd-logo.png";
import classes from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer>
      <span className={classes.merkal}>
        Made with <span className={classes.heart}>❤</span> by m3rkvl
      </span>
      <span className={classes.year}>2022</span>
      <span className={classes.tmdb}>
        Made possible by{" "}
        <a href="https://www.themoviedb.org" rel="noreferrer" target="_blank">
          <img src={tmdbLogo} alt="TMDb Logo" className={classes.logo} />
        </a>
      </span>
    </footer>
  );
};

export default Footer;
