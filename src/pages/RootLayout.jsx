import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";
import classes from "./RootLayout.module.scss";

function RootLayout() {
  return (
    <Fragment>
      <Nav />
      <main className={classes.main}>
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  );
}

export default RootLayout;
