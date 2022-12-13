import classes from "./NavBtnInner.module.scss";
import { NavLink } from "react-router-dom";

import DiscoverIcon from "../../../icons/DiscoverIcon";
import UserIcon from "../../../icons/UserIcon";
import { UserAuth } from "../../../context/AuthContext";

const NavBtnInner = (props) => {
  const { user } = UserAuth();
  const icon = props.role === "discover" ? <DiscoverIcon /> : <UserIcon />;
  //prettier-ignore
  const inactiveClass = `${classes.NavBtn} ${props.role === "discover" ? classes.discover : classes.user}`;
  //prettier-ignore
  const activeClass = `${inactiveClass} ${classes.active} ${ props.role === "discover" ? classes.activeDiscover : classes.activeUser }`;

  return (
    <NavLink
      aria-label={`navigate to "/${props.role}" page`}
      to={`/${props.role}`}
      className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      draggable="false"
    >
      {props.role === "me" && user.photoURL ? (
        <img
          className={classes.userPhoto}
          src={user?.photoURL}
          alt="user avatar"
        />
      ) : (
        icon
      )}
    </NavLink>
  );
};

export default NavBtnInner;
