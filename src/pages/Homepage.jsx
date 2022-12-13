import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import classes from "./Homepage.module.scss";

const Homepage = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user !== undefined) navigate("/discover");
    if (!user && user !== undefined) navigate("/auth");
  });

  return (
    <Fragment>
      {user === undefined && <div className={classes.loading}>W</div>}
    </Fragment>
  );
};

export default Homepage;
